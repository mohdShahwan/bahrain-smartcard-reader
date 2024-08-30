# bahrain-smartcard-reader

## PCSC Documentation

### Transmit Example: [0x00,0xA4,0x04,0x00,0x0D,0xD4,0x99,0x00,0x00,0x01,0x01,0x01,0x00,0x01,0x00,0x00,0x00,0x01]

- 0x00 is the CLA (Class byte): ISO/IEC 7816-4
- 0xA4 is the INS (Instruction byte): 0xA4 used for SELECT command
- P1 (Parameter 1): instruction parameter 1: this byte specifies options for the command
0x04 means "Select by name"
- P2 (Parameter 2): instruction parameter 2: this byte specifies additional options for the command
0x00 indicates for the first occurrence or the standard selection
- Lc (Length of command data): indicates the number of bytes of command data follow
0x0D indicates that 13 bytes of data will follow
- Data: the command data
0xD4, 0x99, 0x00, 0x00, 0x01, 0x01, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01
13-byte identifier for the file being selected
- Le (Length of expected response data): indicates the maximum number of bytes expected in the response

### Definitions

EF (Elementary File):
- An Elementary File is the basic data storage unit in a smart card file system.
- EFs can store various types of data, such as binary data, fixed-length records, or variable-length records.
- There are several types of EFs, including Transparent EF (binary data), Linear Fixed EF (records of fixed length), and Cyclic EF (circular buffer of fixed-length records).
- Each EF is identified by a unique file identifier (FID) within its directory.

DF (Dedicated File):
- A Dedicated File acts as a directory that can contain other DFs or EFs.
- DFs help organize the file system on the smart card into a hierarchical structure, similar to directories and subdirectories in a traditional file system.
- The Master File (MF) is a special type of DF that is the root directory of the smart card file system.
- Each DF is identified by a unique file identifier (FID).
