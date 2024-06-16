var pcsc = require("pcsclite");

var pcsc = pcsc();

pcsc.on("reader", function (reader) {
  console.log("New reader detected", reader.name);

  reader.on("error", function (err) {
    console.log("Error(", this.name, "):", err.message);
  });

  reader.on("status", function (status) {
    console.log("Status(", this.name, "):", status);
    /* check what has changed */
    var changes = this.state ^ status.state;
    if (changes) {
      if (
        changes & this.SCARD_STATE_EMPTY &&
        status.state & this.SCARD_STATE_EMPTY
      ) {
        console.log("card removed"); /* card removed */
        reader.disconnect(reader.SCARD_LEAVE_CARD, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Disconnected");
          }
        });
      } else if (
        changes & this.SCARD_STATE_PRESENT &&
        status.state & this.SCARD_STATE_PRESENT
      ) {
        console.log("card inserted"); /* card inserted */
        reader.connect(
          { share_mode: this.SCARD_SHARE_SHARED },
          function (err, protocol) {
            if (err) {
              console.log(err);
            } else {
              console.log("Protocol(", reader.name, "):", protocol);
              // Select DF by name
              const selectApduCommand = Buffer.from([
                0x00, 0xa4, 0x04, 0x00, 0x0d, 0xd4, 0x99, 0x00, 0x00, 0x01,
                0x01, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
              ]);

              reader.transmit(
                selectApduCommand,
                255,
                protocol,
                function (err, data) {
                  if (err) {
                    console.error("Error selecting application:", err);
                  } else {
                    console.log(
                      "Application selection response:",
                      data.toString("hex")
                    );

                    // Select DF file
                    const selectDfCommand = Buffer.from([
                      0x00, 0xa4, 0x00, 0x0c, 0x02, 0x01, 0x01,
                    ]);
                    reader.transmit(
                      selectDfCommand,
                      255,
                      protocol,
                      (err, response) => {
                        if (err) {
                          console.error("Error selecting DF:", err);
                        } else {
                          // Select first data file
                          const selectDfCommand = Buffer.from([
                            0x00, 0xa4, 0x02, 0x0c, 0x02, 0x00, 0x01,
                          ]);
                          reader.transmit(
                            selectDfCommand,
                            255,
                            protocol,
                            (err, response) => {
                              if (err) {
                                console.error(
                                  "Error selecting first data file:",
                                  err
                                );
                              } else {
                                // Reade first record in the first data file
                                const readBinaryCommand = Buffer.from([
                                  0x00, 0xb0, 0x00, 0x00, 0xff,
                                ]);
                                reader.transmit(
                                  readBinaryCommand,
                                  512,
                                  protocol,
                                  (err, response) => {
                                    if (err) {
                                      console.error(
                                        "Error reading first binary data:",
                                        err
                                      );
                                    } else {
                                      console.log(response.toString("utf8"));
                                    }
                                  }
                                );
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  });

  reader.on("end", function () {
    console.log("Reader", this.name, "removed");
  });
});



pcsc.on("error", function (err) {
  console.log("PCSC error", err.message);
});
