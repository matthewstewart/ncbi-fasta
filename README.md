# NCBI Fasta Tool
Work In Progress. A global npm module for processing data from ncbi into fasta files.  
Currently only working on Mac and Linux.

## Install
```
sudo npm install -g ncbi-fasta
```

## How To Use
Command line scripts available

### ncbi-get-location
Takes a source fasta file, calls ncbi by accession number, gets location and rewrites fasta.
```
ncbi-get-location ./path/to/source.fas ./path/to/dest.fas
```