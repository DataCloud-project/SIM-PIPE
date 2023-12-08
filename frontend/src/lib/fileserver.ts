
let files = [
    { id: 1, name: 'File 1', size: 123, type: 'image/png' },
    { id: 2, name: 'File 2', size: 456, type: 'file/txt' },
    { id: 3, name: 'File 3', size: 456, type: 'file/zip' },
    { id: 4, name: 'File 4', size: 456, type: 'file/zip' },
  ];

export async function getArtifacts() {  
    return {
      body: {
        files,
      },
    };
  }
export async function createArtifact({ params }: { params: { name: string} }) {
    // get array of file ids
    const fileIds = files.map(file => file.id);
    // get the max id
    const maxId = Math.max(...fileIds);
    // create new file object
    const newFile = {
      id: maxId + 1,
      name: params.name,
      size: Math.random(),
      type: 'file/txt',
    };
    files.push(newFile);
    return {
        body: {
            message: 'Artifact uploaded successfully',
        },
    };
}


export async function deleteArtifact({ id }: {id: number}) {
    const file_to_delete = files.filter(file => file.id == id);
    const filename = file_to_delete[0].name
    files = files.filter(file => file.id !== id);
    return {
      body: {
        message: `Artifact ${filename} deleted successfully`,
      },
    };
  }
  