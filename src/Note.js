import React from "react";
import {Button} from "react-bootstrap";

export default function Note({ data, handleEdit, handleDelete }) {
  return (
    <div className="list-group">
      {
        data.map((title, index) =>{
          return(
            <div key={index} className="list-group-item list-group-item-action">
                  <div className="row">
                    <div className="col-sm-10">
                      <h5 className="mb-1">{title.judul}</h5>
                      <p className="mb-1">{title.text}</p>
                      <p className="mb-1">{title.tanggal}</p>
                    </div>
                    <div className="col-sm-2">
                      <div>
                        <Button style={{marginRight: 5}} onClick={() => handleEdit(title.id)} className="btn btn-sm btn-primary">Edit</Button>
                        <Button onClick={() => handleDelete(title.id)} className="danger btn btn-sm btn-danger">Delete</Button>
                      </div>
                    </div>
                  </div>
            </div>
          );
        })
      }
    </div>
  );
}