##
## author: thanhhungqb@gmail.com
## date: Apr. 2016
##
## This script is use to merge all .gs files to AllInOne.gs
## Because is difficult to manage multi-file on Google Script project for 
## person who do not use external tools like Eclipse, ... then
##
## work on python 3.3+

import os
import glob

# remove old file if have
try:
    os.remove('AllInOne.js')
except: pass

read_files = glob.glob("*.gs")
with open("AllInOne.js", "wb") as outfile:
    for f in read_files:
        outfile.write(b'\n\n // \n\n')
        with open(f, "rb") as infile:
            outfile.write(infile.read())

