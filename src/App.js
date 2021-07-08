import Note from "./Note";
import { useState, useEffect } from 'react';
import { uid } from "uid";
import axios from "axios";
import moment from "moment";
import {Container, Button, Form, Navbar, Col, Row, Image} from "react-bootstrap";

function App() {
  const [titles, setTitles] = useState([]);

  const [isUpdate, setIsUpdate] = useState({id: null, status: false});

  const [formData, setFormData] = useState({
    judul: "",
    text: "",
    tanggal: formatTime(),
  });

  const dateTime = new Date();

  useEffect(() =>{
    axios.get("http://localhost:3000/notes").then((res) =>{
      console.log(res.data);
      setTitles(res?.data ?? []);
    });
  }, []);

  function handleChange(e){
    let data = {...formData};
    data[e.target.name] = e.target.value;
    setFormData(data);
  }

  function handleSubmit(e){
    e.preventDefault();
    alert("Oke");

    let data = [...titles];

    if(formData.judul === ""){
      return false;
    }
    if(formData.text === ""){
      return false;
    }

    if(isUpdate.status){
      data.forEach((title) => {
        if(title.id === isUpdate.id){
          title.judul = formData.judul;
          title.text = formData.text;
          title.tanggal = formatTime();
        }
      });

      axios.put(`http://localhost:3000/notes/${isUpdate.id}`, {
        judul: formData.judul,
        text: formData.text,
        tanggal: formatTime(),
      }).then((res) => {
        alert("Berhasil Mengedit Data");
      });

    }else{
      let newData = { id: uid(), judul: formData.judul, text: formData.text, tanggal: formatTime()};
      data.push(newData);
      axios.post("http://localhost:3000/notes", newData).then((res) => {
        alert("Berhasil Menyimpan Data");
      });
    }

    setIsUpdate({id: null, status: false});
    setTitles(data);
    setFormData({judul: "", text: "", tanggal: ""});
  }

  function handleEdit(id) {
    let data = [...titles];
    let foundData = data.find((title) => title.id === id);
    setFormData({judul: foundData.judul, text: foundData.text, tanggal: foundData.tanggal});
    setIsUpdate({id: id, status: true });
  }

  function handleDelete(id) {
    let data = [...titles];
    let filteredData = data.filter(title => title.id !== id);
    setTitles(filteredData);

    axios.delete(`http://localhost:3000/notes/${id}`).then((res) => {
       alert("Berhasil Menghapus Data");
    });
  }

  function formatTime(){
    let options = {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'}
    return new Date().toLocaleDateString([], options);
  }

  return (
    <div>
      <Navbar bg="primary" variant="dark">
        <Navbar.Brand style={{marginLeft: 130}} href="/" className="fw-bold">My Notes</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Form style={{marginLeft: 710}} className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search Your Title..."
              className="mr-sm-2"
              aria-label="Search"
            />
            <Button style={{marginLeft: 10}} variant="success outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <br/>
      <Container align="center">
        <p className="fw-bold fs-4">{moment(dateTime).format('llll')}</p>
      </Container>
      <Container>
        <Row style={{marginTop: 50}}>
          <Col sm={7}>
            <Image src="../img/Pic_2.svg" width={400}/>
          </Col>
          <Col sm={5}>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label className="fw-bold">Masukkan Judul</Form.Label>
                <Form.Control type="text" onChange={handleChange} value={formData.judul} name="judul" />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label className="fw-bold">Isi Text</Form.Label>
                <Form.Control as="textarea" rows={5} onChange={handleChange} value={formData.text} name="text" />
              </Form.Group>
              <Form.Group>
                <Button type="submit" className="btn btn-primary w-100 mt-3">
                  Save
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <br/><br/>
        <Note handleDelete={handleDelete} handleEdit={handleEdit} data={titles} />
        <br/><br/>
      </Container>
    </div>
  );
}

export default App;
