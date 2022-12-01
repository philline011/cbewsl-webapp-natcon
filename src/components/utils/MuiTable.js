import React, {useEffect, useState} from 'react';
import MUIDataTable from 'mui-datatables';
import {
  Container,
  Grid,
  Fab,
  Button,
  ButtonGroup,
  Paper,
  Typography,
  Link,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/CloudUpload';

function getAddButton(title, handler) {
  if (title !== '') {
    return (
      <Button onClick={handler} arial-label="add" color="primary">
        <AddIcon /> {`Add ${title}`}
      </Button>
    );
  } else {
    return <span></span>;
  }
}
function getEditButton(handler) {
  return (
    <IconButton onClick={handler} arial-label="edit" component="span">
      <EditIcon />
    </IconButton>
  );
}
function getDeleteButton(handler) {
  return (
    <IconButton onClick={handler} arial-label="delete" component="span">
      <DeleteIcon />
    </IconButton>
  );
}
function getUploadButton(handler) {
  return (
    <IconButton onClick={handler} arial-label="upload" component="span">
      <UploadIcon />
    </IconButton>
  );
}

function appendActions(cmd, data) {
  // const {handleEdit, handleDelete} = handlers;
  return data.map(element => {
    let mod_set;
    switch (cmd) {
      case 'update-delete':
        mod_set = [
          getEditButton(() => {

          }),
          // getDeleteButton(() => handleDelete(element)),
          getDeleteButton(() => {

          }),
        ];
        break;
      case 'update-delete-upload':
        mod_set = [
          getEditButton(() => {

          }),
          // getDeleteButton(() => handleDelete(element)),
          getDeleteButton(() => {

          }),
          getUploadButton(() => {

          }),
        ];
        break;
      default:
        // mod_set = [getEditButton(handleEdit)];
        break;
    }
    return Object.assign({}, element, {actions: mod_set});
  });
}

const MuiTable = props => {
  // cmd: cud, cu, c, cd
  const {data, options} = props;
  const {columns, rows} = data;
  let temp = [];

  console.log(columns);
  console.log(rows);
  rows.forEach(element => {
    temp.push({...element, actions: [
      <div>
          <IconButton onClick={()=> {
          }} arial-label="edit" component="span">
            <EditIcon />
          </IconButton>
          <IconButton onClick={()=> {
          }} arial-label="delete" component="span">
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={()=> {
          }} arial-label="delete" component="span">
            <ViewModuleIcon />
          </IconButton>
      </div>
    ]})
  });

  console.log(temp);
  return (
    <MUIDataTable title={''} data={temp} columns={columns} options={options} />
  );
};

export default MuiTable;
