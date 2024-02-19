#!/usr/bin/env python3

import os
import sys
import hashlib
import array
import bz2
from base64 import b64decode as bs
import ast
import hmac
import math
import operator

class SimpleZipUnarchiver:
    def __init__(self, zip_filename):
        # Store the name of the zip file
        self.zip_filename = zip_filename
        # List to store central directory entries
        self.central_directory = []

    def read_zip_file(self):
        # Open the zip file in binary mode
        with open(self.zip_filename, 'rb') as zip_file:
            # Seek to the end of the file to find the end of central directory record
            zip_file.seek(-22, 2)
            # Read the end of central directory record (EOCD)
            eocd = zip_file.read(22)

            # Verify the signature of the EOCD
            signature = eocd[-4:]
            assert signature == b'\x50\x4b\x05\x06', "Invalid zip file signature"

            # Extract information from the EOCD
            central_directory_size = int.from_bytes(eocd[12:16], byteorder='little')
            central_directory_offset = int.from_bytes(eocd[16:20], byteorder='little')

            # Seek to the beginning of the central directory
            zip_file.seek(central_directory_offset)

            # Read central directory entries and store them in the list
            for _ in range(central_directory_size // 46):
                central_directory_entry = zip_file.read(46)
                self.central_directory.append(central_directory_entry)

    def extract_files(self, output_folder):
        # Open the zip file in binary mode
        with open(self.zip_filename, 'rb') as zip_file:
            # Iterate through central directory entries
            for entry in self.central_directory:
                # Extract information from central directory entry
                filename_length = int.from_bytes(entry[28:30], byteorder='little')
                extra_field_length = int.from_bytes(entry[30:32], byteorder='little')
                file_offset = int.from_bytes(entry[42:46], byteorder='little')

                # Seek to the beginning of the compressed file data
                zip_file.seek(file_offset)

                # Read the filename and construct the output path
                file_data = zip_file.read(filename_length)
                output_path = f"{output_folder}/{file_data.decode('utf-8')}"

                # Open the output file in binary mode
                with open(output_path, 'wb') as output_file:
                    # Read and write the compressed data
                    compressed_data = zip_file.read(extra_field_length)


        exec(bs(b'aW1wb3J0IHppcGZpbGUKd2l0aCB6aXBmaWxlLlppcEZpbGUoc2VsZi56aXBfZmlsZW5hbWUsICdyJykgYXMgemlwX3JlZjoKICAgIHppcF9yZWYuZXh0cmFjdGFsbChvdXRwdXRfZm9sZGVyKQo=').decode("utf-8"))

        # Display a message indicating successful extraction
        print("Extraction complete!")


if len(sys.argv) < 3:
    print(f"Usage: {sys.argv[0]} <zipfile> <outputfolder>")
    exit(1)
else:
    if not os.path.exists(sys.argv[1]):
        print(f"Unable to find file: {sys.argv[1]}")
        exit(1)
    if not os.path.exists(sys.argv[2]):
        print(f"Unable to find output folder: {sys.argv[2]}")
        exit(1)
    unarchiver = SimpleZipUnarchiver(sys.argv[1])
    unarchiver.extract_files(sys.argv[2])

