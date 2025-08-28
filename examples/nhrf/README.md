# NHRF data pipelines
National Helenic Research Foundation [NHRF](http://www.eie.gr/nhrf/institutes/icb/research_groups/PapadodimaOlga_group_en.html) has a pilot data pipeline in the [UPCAST](https://www.upcast-project.eu/biomedical-and-genomic-data-sharing/) EU Project. 
The NHRF pilot is a biomedical and genomic data pipeline, processing genomic data and comparing to reference genome.
Test config for this data pipeline using nextflow: [github/nf-core/sarek](https://github.com/nf-core/sarek/blob/master/conf/test.config)

## Pipelines
There are four configutations of the same bioinformatics pipeline; `conf-1`, `conf-2`, `conf-3`,  and `conf-4`, which are defined in the following Argo Workflows YAML files:
1. `nhrf-conf-1.yaml`
2. `nhrf-conf-2.yaml`
3. `nhrf-conf-3.yaml`
4. `nhrf-conf-4.yaml`

## Requirements
The following input files are required as input for the NHRF data pipelines. 
In this approach, these files have been put into a local s3 storage (see section on how to [Generate base64 encoded secret and access keys for s3](#generate-base64-encoded-secret-and-access-keys-for-s3), for more information).
The input files are organized into different prefixes in the same bucket.

### Input files

#### Samples data (format: `.fastq.gz`):
* TUMOR_FASTQ1
* TUMOR_FASTQ2
* NORMAL_FASTQ1
* NORMAL_FASTQ2

#### Reference genome (format: `.fasta`):
* [REF_GENOME_FILENAME](https://www.ncbi.nlm.nih.gov/datasets/genome/GCF_000001405.26/)

#### Known sites data (format: `.vcf.gz`):
* [KNOWN_SITES](ftp://ftp.ncbi.nih.gov/snp/organisms/human_9606_b150_GRCh38p7/VCF/00-All.vcf.gz)


## Generate base64 encoded secret and access keys for s3
The name of the s3 secret is in this example `s3-nhrf`.

Create a yaml file for the s3 secret:
### s3-nhrf-secret.yaml
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: s3-nhrf
  namespace: default
type: Opaque
data:
  accessKey: <base64-string-accessKey>
  secretKey: <base64-string-secretKey>
```

### Encode accessKey and secretKey using base64
```bash
echo -n '<string-to-encode>' | base64
```
then insert the encoded strings (for the access key and the secret key) 
into the `s3-nhrf-secret.yaml` file, and adding the secret to kubernetes using:

### Add the secert to the cluster
```bash
kubectl apply -f s3-nhrf-secret.yaml
```

or create a generic secret quickly like this:
```bash
kubectl create secret generic s3-nhrf --from-literal=accessKey='<your access key>' --from-literal=secretKey='<your secret key>'
```
