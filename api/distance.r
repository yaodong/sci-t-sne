#!/usr/bin/env Rscript

args = commandArgs(trailingOnly=TRUE)
base_id = args[1]
compare_id = args[2]
result_id = args[3]

library("TDA")

base = read.csv(paste("/tmp/diagram", base_id, sep="-"), header=FALSE)
comparing = read.csv(paste("/tmp/diagram", compare_id, sep="-"), header=FALSE)

base = cbind(matrix(1, ncol=1, nrow=nrow(base))[,1], base[,1], base[,2])
comparing = cbind(matrix(1, ncol=1, nrow=nrow(comparing))[,1], comparing[,1], comparing[,2])

bottleneckDist <- bottleneck(base, comparing, dimension = 1)
wassersteinDist <- wasserstein(base, comparing, dimension = 1)

results <- list(bottleneck = bottleneckDist, wasserstein = wassersteinDist)
result_file = paste("/tmp/result", result_id, sep="-")

write.csv(results, file = result_file)
