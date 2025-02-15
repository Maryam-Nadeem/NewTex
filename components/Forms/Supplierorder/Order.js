import React, { useState, map } from "react";

import PageHeader from "../../PageHeader";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/AccountBalance";
import {
  Paper,
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import useTable from "../../useTable";
import Controls from "../../controls/Controls";
import { FormatColorResetOutlined, Search } from "@material-ui/icons";
import axios from "axios";
import AddIcon from "@material-ui/icons/Add";
import Popup from "../../Popup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import Notification from "../../Notification";
import ConfirmDialog from "../../ConfirmDialog";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const headCells = [
  { id: "upc", label: "Item UPC" },
  { id: "material", label: "Raw material " },
  { id: "price", label: "Price" },
  { id: "createdAt", label: "Production Date" },
  { id: "quantity", label: "Quantity" },
  { id: "actions", label: "Actions" },
];
const useStyles = makeStyles({
  root: {
    minWidth: 75,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function SupplierOrder() {
  const classes = useStyles();
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [openPopup, setOpenPopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [search, setSeach] = useState("");
  let [item, setitem] = useState("");
  const [holder, setholder] = useState([]);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [userList, setUserList] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [users, setUsers] = useState([]);

  const { TblContainer, TblHead, TblPagination, recordsAfterPaging } = useTable(
    headCells,
    users,
    filterFn
  );

  const handleSearch = (e) => {
    e.preventDefault();
    let target = e.target;
    setSeach(target.value);
    setFilterFn({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((x) =>
            x.upc.toLowerCase().includes(target.value)
          );
      },
    });
  };
  React.useEffect(() => {
    axios
      .get("http://localhost:5000/user/getsuppliersItems")
      .then((response) => {
        console.log(response);
        setUsers(response.data);
      });
  }, []);

  const addOrEdit = (user, resetForm) => {
    setOpenPopup(false);
    // if(user.id!=0)
    //    {updateUser();}
    setNotify({
      isOpen: true,
      message: `Submitted Successfully at transaction ID : ${user}`,
      type: "success",
    });
    setRecordForEdit(null);
    resetForm;
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  const onDelete = (item_id) => {
    console.log(item_id);
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });

    setNotify({
      isOpen: true,
      message: "Deleted Successfully",
      type: "error",
    });
  };

  return (
    <>
      <PageHeader
        title="New Product"
        subTitle="Adding products for Access"
        icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
      />

      <Paper style={{ margin: "2px", padding: "2px" }}>
        <Toolbar>
          <Controls.Input
            style={{ width: "50%" }}
            label="Search Users"
            //   className={classes.SerachInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            onChange={handleSearch}
          />
          <Controls.MainButton
            style={{ position: "absolute", right: "10px" }}
            text="Add New"
            //    className={classes.newButton}
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              setOpenPopup(true);
              setRecordForEdit(null);
            }}
          />
        </Toolbar>
        {recordsAfterPaging().map((item) => (
          <Card className={classes.root} variant="outlined">
            <CardContent key={item.user_id}>
              Supplier Name:
              <Typography variant="h5" component="h2">
                {item.user_name}
              </Typography>
              <Typography
                className={classes.title}
                color="textPrimary"
                gutterBottom
              >
                Email: {item.email}
              </Typography>
              <Typography variant="body2" component="p">
                Location: {item.location}
              </Typography>
              <Typography className={classes.pos} color="textPrimary">
                Items Available: {item.Item_list}
                <br />
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="textPrimary">
                {" "}
                Place Order
              </Button>
            </CardActions>
          </Card>
        ))}

        <TblPagination />
      </Paper>

      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}

// return (
//     <>
//         <PageHeader
//             title="New Employee"
//             subTitle="Form design with validation"
//             icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
//         />
//         <Paper style={{margin:'2px',padding:'2px'}}>
//         {/* <InventoryForm/> */}

//             <Toolbar>
//                 <Controls.Input
//                 style={{width:'50%'}}
//                   label="Search Users"
//                 //   className={classes.SerachInput}
//                   InputProps={{
//                       startAdornment: (<InputAdornment position="start">
//                           <Search/>
//                       </InputAdornment>)
//                    }}
//                   onChange={handleSearch}
//                 />
//                 <Controls.Button
//                 style={{position:'absolute', right:'10px'}}
//                    text="Add New"
//                 //    className={classes.newButton}
//                    variant="outlined"
//                    startIcon={<AddIcon/>}
//                    onClick={()=>{setOpenPopup(true);setRecordForEdit(null);}}
//                 />
//             </Toolbar>
//             <TblContainer>
//                 <TblHead/>
//                 <TableBody>

//                 {

//                      recordsAfterPaging().map(item=>
//                     (<TableRow key={item.id}>

//                             <TableCell>{item.name}</TableCell>
//                             <TableCell>{item.employee_id}</TableCell>
//                             <TableCell>{item.phone}</TableCell>
//                             <TableCell>{item.city}</TableCell>
//                             <TableCell>{item.gender}</TableCell>
//                             <TableCell>{item.department}</TableCell>
//                             {/* <TableCell>{item.date}</TableCell> */}
//                             <TableCell>
//                                 <Controls.ActionButton
//                                 color="primary"
//                                 onClick={()=>{openInPopup(item)}}>
//                                     <EditOutlinedIcon fontSize="small"/>
//                                 </Controls.ActionButton>
//                                 <Controls.ActionButton
//                                 color="secondary"
//                                 onClick={()=>{
//                                     setConfirmDialog({
//                                         isOpen:true,
//                                         title:'Are you sure to delete this record?',
//                                         subTitle:"You can't undo this operation",
//                                         onConfirm:()=>{onDelete(item.id)}
//                                     })
//                                     }}>
//                                     <CloseIcon fontSize="small"/>
//                                 </Controls.ActionButton>
//                             </TableCell>
//                         </TableRow>))
// }
//                 </TableBody>
//             </TblContainer>
//             <TblPagination/>
//         </Paper>
//         <Popup
//           title="Employee Form"
//           openPopup={openPopup}
//           setOpenPopup={setOpenPopup}
//         >
//           <InventoryForm
//            addOrEdit={addOrEdit}
//            setOpenPopup={setOpenPopup}
//            recordForEdit={recordForEdit}
//         />
//         </Popup>
//         <Notification
//           notify={notify}
//           setNotify={setNotify}
//         />
//         <ConfirmDialog
//          confirmDialog={confirmDialog}
//          setConfirmDialog={setConfirmDialog}
//          />

//     </>
// )
// }
