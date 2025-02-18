# NHRF data pipeline
National Helenic Research Foundation [NHRF](http://www.eie.gr/nhrf/institutes/icb/research_groups/PapadodimaOlga_group_en.html) has a pilot data pipeline in the [UPCAST](https://www.upcast-project.eu/biomedical-and-genomic-data-sharing/) EU Project. The NHRF pilot is a biomedical and genomic data pipeline, processing genomic data and comparing to reference genome.

# generated base64 encoded secret and access keys for s3

Encode string using base64
```bash
echo -n '<string-to-encode>' | base64
```
then insert the encoded strings (for the access key and the secret key) 
into the `s3-nhrf-secret.yaml` file, and adding the secret to kubernetes using:

```bash
kubectl apply -f s3-nhrf-secret.yaml
```

