import os
import glob
import pandas as pd

path = "./datasets/"
output = "./concatenated_data.csv"

os.chdir(path)
fileList = glob.glob("*.csv")
dfList = []
colNames = ["Letter","Pinky", "Ring", "Middle", "Index", "Thumb", "X", "Y", "Z"]

for filename in fileList:
  print(filename)
  df = pd.read_csv(filename, header=None)
  dfList.append(df)

concatDf = pd.concat(dfList, axis=0)
concatDf.columns = colNames
concatDf.to_csv(output, index=None)