#!/usr/bin/env Rscript

install.packages("devtools", repos = "https://cran.rstudio.org/")
require(devtools);
install_version('igraph', version='1.0.1', repos='https://cran.rstudio.org')
install_version('TDA', version='1.4.1', repos='https://cran.rstudio.org')
