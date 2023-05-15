use anyhow::Result;
use human_repr::{HumanCount, HumanDuration, HumanThroughput};
use nix::unistd::{getuid, setuid, Uid};
use reqwest;
use std::env;
use std::path::Path;
use tokio::fs::File;
use tokio::io::AsyncWriteExt;

#[derive(Debug)]
struct Download {
    filename: String,
    url: String,
}

struct DownloadTask {
    download: Download,
    task: tokio::task::JoinHandle<Result<()>>,
    start: std::time::Instant,
}

fn change_id() -> Result<()> {
    let new_id = env::var("UID")
        .unwrap_or("1000".to_string())
        .parse::<u32>()
        .expect("Failed to parse UID");
    let new_uid = Uid::from_raw(new_id);

    let current_uid = getuid();
    println!("Current UID: {}", current_uid);

    match setuid(new_uid) {
        Ok(_) => println!("Successfully changed UID to {}", new_uid),
        Err(e) => return Err(anyhow::Error::msg(format!("Failed to change UID: {}", e))),
    }

    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    change_id()?;

    let output_folder = env::var("OUTPUT_FOLDER").unwrap_or(".".to_string());

    let mut downloads = vec![];
    for (key, value) in env::vars() {
        if key.starts_with("DOWNLOAD_") {
            let filename = key[9..].trim();
            let path = Path::new(filename);
            if path.components().count() != 1 {
                return Err(anyhow::Error::msg("filename contains directory components"));
            }
            let filename = path
                .file_name()
                .and_then(|f| f.to_str())
                .ok_or_else(|| anyhow::Error::msg("invalid file name"))?
                .to_owned();
            let url = value.trim().to_owned();
            let download = Download { filename, url };
            downloads.push(download);
        }
    }

    let mut tasks = vec![];
    for download in downloads {
        let url = download.url.clone();
        let filename = download.filename.clone();
        println!("Downloading {} to {}", url.clone(), filename);
        let output_folder = output_folder.clone();
        let task = tokio::spawn(async move {
            let response = reqwest::get(url).await?;
            // create a path with outputFolder + filename
            let path = Path::new(&output_folder).join(filename);
            let mut file = File::create(path).await?;
            let bytes = response.bytes().await?;
            file.write_all(&bytes).await?;
            Ok(()) as Result<()>
        });
        tasks.push(DownloadTask {
            download,
            task,
            start: std::time::Instant::now(),
        });
    }

    for task in tasks {
        task.task.await??;
        let duration = task.start.elapsed();
        let filename = Path::new(&output_folder).join(&task.download.filename);
        let file_size = std::fs::metadata(filename.clone())?.len();

        println!(
            "Downloaded {} from {} to {} in {} seconds ({})",
            file_size.human_count_bytes(),
            task.download.url,
            filename.display(),
            duration.human_duration(),
            (file_size as f64 / duration.as_secs_f64()).human_throughput_bytes(),
        )
    }

    Ok(())
}
