import React, { Component, useState } from "react";
import MUIDataTable from "mui-datatables";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { GrEdit } from "react-icons/gr";
import { AiOutlineDelete } from "react-icons/ai";
import ClearIcon from "@material-ui/icons/Clear";
import EditIcon from "@material-ui/icons/Edit";
import "./DataTable.css";
import { IconContext } from "react-icons/lib";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextareaAutosize,
  TextField,
} from "@material-ui/core";
import { setadminData } from "../../redux/slice/loginSlice";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIssueBookId, setIssueUserId } from "../../redux/slice/homeSlice";
import Api from "../../api";

let classes = {};

const options = {
  filterType: "textField",
  responsive: "scroll",
};
const api = new Api();

export default function DataTable({ rows, columns, title, handleTrigger }) {
  let state = {};
  const history = useHistory();
  const dispatch = useDispatch();
  const home = useSelector((state) => state.home);
  const login = useSelector((state) => state.login);
  const { adminData } = login;
  // const {adminData}=login
  const { IssueBookId, IssueUserId } = home;
  const [open, setOpen] = React.useState(false);
  const [data, setdata] = useState();
  const [formData, setFormData] = useState({
    admin_username: "",
    admin_role: "",
  });

  const [userData, setUserData] = useState({
    user_name: "",
    user_phone: "",
    user_address: "",
  });

  const [bookData, setBookData] = useState({
    book_name: "",
    book_isbn: "",
    book_quantity: "",
    book_author: "",
    genre_type: "",
  });

  // console.log("data", data);
  const handleClickOpen = (data) => {
    switch (title) {
      case "Admin":
        setdata(data);
        setOpen(true);
        break;
      case "User":
        setdata(data);
        setOpen(true);
        break;
      case "Book":
        setdata(data);
        setOpen(true);
        break;
      default:
        break;
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleChangeUser(evt) {
    const value =
      evt.target.type === "checkbox" ? evt.target.checked : evt.target.value;
    setUserData({
      ...userData,
      [evt.target.name]: value,
    });
    // console.log(userData);
  }

  function handleChangeBook(evt) {
    const value =
      evt.target.type === "checkbox" ? evt.target.checked : evt.target.value;
    setBookData({
      ...bookData,
      [evt.target.name]: value,
    });
  }

  function handleChangeAdmin(evt) {
    const value =
      evt.target.type === "checkbox" ? evt.target.checked : evt.target.value;
    setFormData({
      ...formData,
      [evt.target.name]: value,
    });
  }

  // function handleChange(evt) {
  //   const value =
  //     evt.target.type === "checkbox" ? evt.target.checked : evt.target.value;
  //   switch (title) {
  //     case "Admin":
  //       setFormData({
  //         ...formData,
  //         [evt.target.name]: value,
  //       });
  //       break;
  //     case "User":
  //       setUserData({
  //         ...userData,
  //         [evt.target.name]: value,
  //       });
  //       break;
  //     case "Book":
  //       setBookData({
  //         ...bookData,
  //         [evt.target.name]: value,
  //       });
  //       break;
  //     default:
  //       break;
  //   }
  // }

  React.useEffect(() => {
    if (data) {
      // console.log(data)
      switch (title) {
        case "Admin":
          setFormData({
            admin_username: data && data[1],
            admin_role: data && data[2],
          });
          break;
        case "User":
          setUserData({
            user_name: data && data[1],
            user_phone: data && data[2],
            user_address: data && data[3],
          });
        case "Book":
          setBookData({
            book_name: data && data[1],
            book_isbn: data && data[2],
            book_quantity: data && data[3],
            book_author: data && data[4],
            genre_type: data && data[5],
          });
          break;
        default:
          break;
      }
    }
  }, [open]);
  return (
    <div style={{ maxWidth: "100%" }}>
      <MUIDataTable
        title={title}
        data={rows.map((d) => {
          // console.log(d);
          const f = [
            ...d,
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              style={{
                color: "#000",
                height: "100%",
              }}
              spacing={5}
            >
              <Grid item>
                <Button
                  color="primary"
                  size="large"
                  onClick={async () => {
                    switch (title) {
                      case "Return Book":
                        // console.log(d[3])
                        if (d[3] != "returned") {
                          const data = {
                            return_status: "returned",
                            book_id: d[7],
                            user_id: d[8],
                          };
                          const getIssueData = await api.Calls(
                            `issuedbook/return`,
                            "PUT",
                            data
                          );
                          if (getIssueData.status == 200) {
                            handleTrigger();
                            alert("Book Returned Successfully");
                          } else {
                            alert(getIssueData.msg.response.data.message);
                          }
                        } else {
                          alert("Book Is already Returned");
                        }

                        break;
                      case "Select Book":
                        if (d[3] > 0) {
                          dispatch(setIssueBookId(d[0]));
                          history.push("issue/issueuser");
                          // console.log("issue", d);
                        } else {
                          alert("Book Not Available");
                        }

                        break;

                      case "Select User":
                        // dispatch(setIssueUserId(d[0]));
                        const data = {
                          admin_id: login.adminData.admin_id,
                          book_id: IssueBookId,
                          user_id: d[0],
                        };
                        const getIssueData = await api.Calls(
                          `issuedbook/`,
                          "POST",
                          data
                        );
                        if (getIssueData.status == 201) {
                          // handleTrigger();
                          dispatch(setIssueBookId(null));
                          alert("Book Issued  Successfully");
                          history.push("return");
                        } else {
                          alert(getIssueData.msg.response.data.message);
                        }
                        // alert("Book Issued Successfully");
                        // console.log("issueUser", d[0]);
                        break;
                      default:
                        handleClickOpen(d);
                        break;
                    }
                  }}
                >
                  <IconContext.Provider>
                    <div
                      style={{
                        padding: "1rem 1rem",
                        backgroundColor: "#4caf50",
                        borderRadius: 3,
                        color: "white",
                      }}
                    >
                      {title == "Return Book" ? (
                        "Return Book"
                      ) : title == "Select Book" ? (
                        "Select"
                      ) : title == "Select User" ? (
                        "Issua A Book"
                      ) : (
                        <EditIcon />
                      )}
                    </div>
                  </IconContext.Provider>
                </Button>
              </Grid>
              {title != "Return Book" &&
                title != "Select Book" &&
                title != "Select User" && (
                  <Grid item>
                    <Button
                      color="secondary"
                      size="large"
                      onClick={async () => {
                        switch (title) {
                          case "Admin":
                            const getAdminData = await api.Calls(
                              `admin/${d[0]}`,
                              "DELETE"
                            );
                            if (getAdminData.status == 200) {
                              handleTrigger();
                              alert("Admin Deleted Successfully");
                            } else {
                              alert(getAdminData.msg.response.data.message);
                            }
                            break;
                          case "User":
                            //  console.log(d[0]);
                            const getUserData = await api.Calls(
                              `user/${d[0]}`,
                              "DELETE"
                            );
                            if (getUserData.status == 200) {
                              handleTrigger();
                              alert("User Deleted Successfully");
                            } else {
                              alert(getUserData.msg.response.data.message);
                            }

                            break;
                          case "Book":
                            const getBookData = await api.Calls(
                              `book/${d[0]}`,
                              "DELETE"
                            );
                            if (getBookData.status == 200) {
                              handleTrigger();
                              alert("Book Deleted Successfully");
                            } else {
                              alert(getBookData.msg.response.data.message);
                            }
                            break;

                          default:
                            break;
                        }
                      }}
                    >
                      <IconContext.Provider>
                        <div
                          style={{
                            padding: "1rem 1rem",
                            backgroundColor: "#f44335",
                            borderRadius: 3,
                            color: "white",
                          }}
                        >
                          <ClearIcon />
                        </div>
                      </IconContext.Provider>
                    </Button>
                  </Grid>
                )}
            </Grid>,
          ];
          // console.log(f);
          return f;
        })}
        columns={columns}
        options={options}
      />

      {title == "User" && (
        <div>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            </div>

            <DialogContent>
              <div className={classes.root} autoComplete="off">
                <TextField
                  style={{ marginTop: 0 }}
                  variant="outlined"
                  required
                  fullWidth
                  id="user_name"
                  label="User Name"
                  name="user_name"
                  defaultValue={data && data[1]}
                  // autoComplete="phone"
                  onChange={handleChangeUser}
                />
                <TextField
                  style={{ marginTop: 20 }}
                  variant="outlined"
                  required
                  fullWidth
                  id="user_phone"
                  label="Phone Number"
                  name="user_phone"
                  defaultValue={data && data[2]}
                  // autoComplete="phone"
                  onChange={handleChangeUser}
                />
                <TextField
                  style={{ marginTop: 20 }}
                  variant="outlined"
                  required
                  fullWidth
                  id="user_address"
                  label="Address"
                  name="user_address"
                  defaultValue={data && data[3]}
                  // autoComplete="phone"
                  onChange={handleChangeUser}
                />
              </div>
            </DialogContent>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                style={{ marginTop: 20, width: "90%", marginBottom: 30 }}
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={async () => {
                  console.log(userData);
                  const getUserData = await api.Calls(
                    `user/${data[0]}`,
                    "PUT",
                    userData
                  );
                  if (getUserData.status == 200) {
                    handleTrigger();
                    alert("User Updated Successfully");
                  } else {
                    alert(getUserData.msg.response.data.message);
                  }
                  setOpen(false);
                }}
              >
                Update {title}
              </Button>
            </div>
          </Dialog>
        </div>
      )}

      {title == "Admin" && (
        <div>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            </div>

            <DialogContent>
              <div className={classes.root} autoComplete="off">
                <TextField
                  style={{ marginTop: 0 }}
                  variant="outlined"
                  required
                  fullWidth
                  id="admin_username"
                  label="Admin Username"
                  name="admin_username"
                  defaultValue={data && data[1]}
                  // autoComplete="phone"
                  onChange={handleChangeAdmin}
                />
                <TextField
                  style={{ marginTop: 20 }}
                  variant="outlined"
                  required
                  fullWidth
                  id="admin_role"
                  label="Admin Role"
                  name="admin_role"
                  defaultValue={data && data[2]}
                  // autoComplete="phone"
                  onChange={handleChangeAdmin}
                />
              </div>
            </DialogContent>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                style={{ marginTop: 20, width: "90%", marginBottom: 30 }}
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={async () => {
                  const getAdminData = await api.Calls(
                    `admin/${data[0]}`,
                    "PUT",
                    formData
                  );
                  if (getAdminData.status == 200) {
                    handleTrigger();
                    alert("Admin Updated Successfully");
                  } else {
                    alert(getAdminData.msg.response.data.message);
                  }
                  // console.log(formData)

                  setOpen(false);
                }}
              >
                Update {title}
              </Button>
            </div>
          </Dialog>
        </div>
      )}

      {title == "Book" && (
        <div>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            </div>

            <DialogContent>
              <div className={classes.root} autoComplete="off">
                <TextField
                  style={{ marginTop: 0 }}
                  variant="outlined"
                  required
                  fullWidth
                  id="book_name"
                  label="Book Name"
                  name="book_name"
                  defaultValue={data && data[1]}
                  // autoComplete="phone"
                  onChange={handleChangeBook}
                />
                <TextField
                  style={{ marginTop: 20 }}
                  variant="outlined"
                  required
                  fullWidth
                  id="book_isbn"
                  label="Book ISBN"
                  name="book_isbn"
                  defaultValue={data && data[2]}
                  // autoComplete="phone"
                  onChange={handleChangeBook}
                />
                <TextField
                  style={{ marginTop: 20 }}
                  variant="outlined"
                  required
                  fullWidth
                  id="book_quantity"
                  label="Quantity"
                  name="book_quantity"
                  defaultValue={data && data[3]}
                  // autoComplete="phone"
                  onChange={handleChangeBook}
                />

                <TextField
                  style={{ marginTop: 20 }}
                  variant="outlined"
                  required
                  fullWidth
                  id="book_author"
                  label="Author"
                  name="book_author"
                  defaultValue={data && data[4]}
                  // autoComplete="phone"
                  onChange={handleChangeBook}
                />

                <TextField
                  style={{ marginTop: 20 }}
                  variant="outlined"
                  required
                  fullWidth
                  id="genre_type"
                  label="Genre"
                  name="genre_type"
                  defaultValue={data && data[5]}
                  // autoComplete="phone"
                  onChange={handleChangeBook}
                />
              </div>
            </DialogContent>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                style={{ marginTop: 20, width: "90%", marginBottom: 30 }}
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={async () => {
                  const getBookData = await api.Calls(
                    `book/${data[0]}`,
                    "PUT",
                    bookData
                  );
                  if (getBookData.status == 200) {
                    handleTrigger();
                    alert("Book Updated Successfully");
                  } else {
                    alert(getBookData.msg.response.data.message);
                  }

                  setOpen(false);
                }}
              >
                Update {title}
              </Button>
            </div>
          </Dialog>
        </div>
      )}
    </div>
  );
}
