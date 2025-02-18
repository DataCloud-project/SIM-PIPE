KNOWN_SITES_VCF="dbsnp_146.hg38.vcf.gz"  # Known variant sites for BQSR, if needed

# Step 1: Quality Control with FastQC
# quay.io/biocontainers/fastqc:0.12.1
fastqc ${TUMOR_FASTQ1} ${TUMOR_FASTQ2} ${NORMAL_FASTQ1} ${NORMAL_FASTQ2} -o fastqc_results/

# Step 2: Trimming with Fastp 
# quay.io/biocontainers/fastp:0.23.4
fastp -i ${TUMOR_FASTQ1} -I ${TUMOR_FASTQ2} -o trimmed_tumor_R1.fastq.gz -O trimmed_tumor_R2.fastq.gz -h tumor_fastp.html -j tumor_fastp.json
fastp -i ${NORMAL_FASTQ1} -I ${NORMAL_FASTQ2} -o trimmed_normal_R1.fastq.gz -O trimmed_normal_R2.fastq.gz -h normal_fastp.html -j normal_fastp.json

# Step 3: Alignment with BWA-MEM to hg38
# quay.io/biocontainers/bwa:0.7.13
# quay.io/biocontainers/samtools:1.19.2

bwa index ${REF_GENOME}
bwa mem -t 8 ${REF_GENOME} trimmed_tumor_R1.fastq.gz trimmed_tumor_R2.fastq.gz | samtools view -Sb - | samtools sort -o tumor_sorted.bam -
bwa mem -t 8 ${REF_GENOME} trimmed_normal_R1.fastq.gz trimmed_normal_R2.fastq.gz | samtools view -Sb - | samtools sort -o normal_sorted.bam -

# Step 4: Mark Duplicates with GATK

# quay.io/biocontainers/gatk4:4.5.0.0

gatk MarkDuplicates -I tumor_sorted.bam -O tumor_dedup.bam -M tumor_metrics.txt
gatk MarkDuplicates -I normal_sorted.bam -O normal_dedup.bam -M normal_metrics.txt

# Step 5: Base Quality Score Recalibration (BQSR) (optional, depending on data quality)
gatk BaseRecalibrator -I tumor_dedup.bam -R ${REF_GENOME} --known-sites ${KNOWN_SITES_VCF} -O tumor_recal_data.table
gatk ApplyBQSR -R ${REF_GENOME} -I tumor_dedup.bam --bqsr-recal-file tumor_recal_data.table -O tumor_recal.bam
gatk BaseRecalibrator -I normal_dedup.bam -R ${REF_GENOME} --known-sites ${KNOWN_SITES_VCF} -O normal_recal_data.table
gatk ApplyBQSR -R ${REF_GENOME} -I normal_dedup.bam --bqsr-recal-file normal_recal_data.table -O normal_recal.bam