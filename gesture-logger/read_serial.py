import serial
import csv

count = 0

ser = serial.Serial('/dev/ttyUSB0', 115200)
ser.flushInput()
letter = ""
letter = raw_input("Letter : ")

while count < 50:
  if letter != "":
    serial_line = ser.readline()
    data=serial_line.replace("\n","")

    count = count + 1
    print "Count: ",count

    DATASPLIT= data.split(',')
    DATASPLIT.insert(0,letter)
    print DATASPLIT
    with open("./datasets/"+letter+"_data.csv","a") as f:
      writer = csv.writer(f,delimiter=",",lineterminator="\n")
      writer.writerow(DATASPLIT)


ser.close()