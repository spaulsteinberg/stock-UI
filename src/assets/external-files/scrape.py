__author__ = "Samuel Steinberg"

import csv

symbol_list = []
# open the csv file from the nasdaq site and read it into a list
with open("companylist.csv", newline='') as file:
    reader = csv.reader(file, delimiter=",")
    symbol_list = [row[0] for row in reader]

# create an output file but skip writing the header line
with open("outputsymbols.txt", 'w') as file:
    for i in range(1, len(symbol_list)):
        file.writelines(f'{symbol_list[i]}\n')

nyse_symbol_list = []
with open("companynyse.csv", newline='') as file:
    reader = csv.reader(file, delimiter=",")
    nyse_symbol_list = [row[0] for row in reader]

# remove some symbols like class A/B/C, etc.
for nyse_symbol in nyse_symbol_list:
    if nyse_symbol.isalpha() == False:
        nyse_symbol_list.remove(nyse_symbol)
        continue
    if nyse_symbol.find("^") != -1:
        nyse_symbol_list.remove(nyse_symbol)
        continue
# had to manually remove some symbols, not all caught by above
with open("outputnyse.txt", 'w') as file:
    for i in range(1, len(nyse_symbol_list)):
        file.writelines(f'{nyse_symbol_list[i]}\n')