import React, { useState, useReducer, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { FaPlus, FaMinusCircle } from "react-icons/fa";
import "fontsource-roboto";
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  Drawer,
  Slider,
  Button,
  Typography,
  CssBaseline,
  TextField,
  Menu,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Grid,
  FormControl,
  FormLabel,
  Select,
  Checkbox,
  CircularProgress,
} from "@material-ui/core";
import { set } from "mongoose";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  title: {
    textAlign: "center",
    margin: "10px auto",
  },
  drawer: {
    width: 250,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 250,
  },
  drawerListItem: {
    margin: "10px auto",
  },
  filterWrapper: {
    margin: "0 auto",
    width: "85%"
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
  },
  dropdownButton: {
    position: "fixed",
    top: 0,
    right: 0,
  },
  dropdown: {
    position: "fixed",
    top: 0,
    right: 0,
  },
  modal: {
    width: "50%",
    maxHeight: "80%",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: "auto",
    outline: "none",
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: "center",
  },
  typography: {
    padding: theme.spacing(1),
  },
  image: {
    maxWidth: "100%",
  },
  bold: {
    fontWeight: "bold",
  },
  table: {
    width: "95%",
  },
  formControl: {
    minWidth: 100,
  },
  input: {
    display: "none",
  },
  formGrid: {
    marginTop: 10,
    marginBottom: 10,
  },
}));

const PageContent = () => {
  const classes = useStyles();

  const attributes = [
    "name",
    "agency",
    "union",
    "daytime",
    "shoe",
    "size",
    "phone",
    "email",
    "height",
    "age",
  ];
  const [cols, setCols] = useState(["name", "email", "phone"]);
  const [modelsList, setModelsList] = useState();
  const [filteredModelsList, setFilteredModelsList] = useState();
  const [modal, setModal] = useState(false);
  const [model, setModel] = useState({
    name: "",
    agency: "",
    union: "no",
    daytime: "",
    ageMin: "",
    ageMax: "",
    heightFt: "",
    heightIn: "",
    hairColor: "",
    shoe: "",
    size: "",
    skills: [],
    phone: "",
    email: "",
    imageUrl: "",
    resumeUrl: "",
  });
  const [image, setImage] = useState();
  const [resume, setResume] = useState();
  const [currentModel, setCurrentModel] = useState({
    name: "",
    agency: "",
    union: "no",
    daytime: "",
    ageMin: "",
    ageMax: "",
    heightFt: "",
    heightIn: "",
    hairColor: "",
    shoe: "",
    size: "",
    skills: [],
    phone: "",
    email: "",
    imageUrl: "",
    resumeUrl: "",
  });
  const [currentModal, setCurrentModal] = useState(false);
  const [search, setSearch] = useState("");
  const [ageRange, setAgeRange] = useState([10, 60]);
  const [heightRange, setHeightRange] = useState([54, 78]);
  const [shoeArray, setShoeArray] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [formLoading, setFormLoading] = useState(false)
  const [nameHelper, setNameHelper] = useState('')

  useEffect(() => {
    axios
      .get("/models")
      .then((res) => {
        setModelsList(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (!modelsList) {
      return;
    }
    setFilteredModelsList(
      modelsList.filter(
        (model) =>
          model.ageMax > ageRange[0] &&
          model.ageMin < ageRange[1] &&
          model.heightFt * 12 + model.heightIn >= heightRange[0] &&
          model.heightFt * 12 + model.heightIn <= heightRange[1]
      ).filter( model => shoeArray.length ? shoeArray.includes(model.shoe) : true).filter( model => search.length ? model.name.toLowerCase().includes(search.toLowerCase()) : true)
    );

  }, [modelsList, search, ageRange, heightRange, shoeArray]);

  const handleChange = (e) => {
    setModel({
      ...model,
      [e.target.name]: e.target.value,
    });
  };

  const handleModelAdd = async (e) => {
    e.preventDefault();
    if(!model.name){
        setNameHelper('Name required')
        return
    }
    setFormLoading(true);
    const payload = {
      ...model,
      imageUrl: await handleImageUpload(),
      resumeUrl: await handleResumeUpload(),
    };
    console.log(payload);
    axios
      .post("/models/add", payload)
      .then((res) => {
        console.log(res.data);
        setModelsList([...modelsList, res.data]);
        setModal(false);
        setModel({
          name: "",
          agency: "",
          union: false,
          daytime: "",
          ageMin: "",
          ageMax: "",
          heightFt: "",
          heightIn: "",
          hairColor: "",
          shoe: "",
          size: "",
          skills: [],
          phone: "",
          email: "",
          imageUrl: "",
          resumeUrl: "",
        });
        setFormLoading(false)
      })
      .catch((err) => console.log(err.response.data));
  };

  const handleSkillsChange = (e) => {
    let skills = e.target.value.split(",");
    let fixedSkills = skills.map((skill) => {
      let trimmedSkill = skill.trim();
      return trimmedSkill.charAt(0).toUpperCase() + trimmedSkill.slice(1);
    });
    setModel({
      ...model,
      skills: fixedSkills,
    });
  };

  const handleImageUpload = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "quad-database");
    data.append("cloud_name", "dayj7wgeb");
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dayj7wgeb/image/upload",
      data
    );
    return res.data.url;
  };

  const handleResumeUpload = async () => {
    if (!resume) {
      return "";
    } else {
      const data = new FormData();
      data.append("file", resume);
      data.append("upload_preset", "quad-resumes");
      data.append("cloud_name", "dayj7wgeb");
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dayj7wgeb/image/upload",
        data
      );
      return res.data.url;
    }
  };

  const handleModalOpen = (id) => {
    let model = modelsList.find((model) => model._id === id);
    setCurrentModel(model);
    setCurrentModal(true);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const heightFormat = (value) => {
    if (value < 60) {
      return `4'${value - 48}"`;
    } else if (value < 72) {
      return `5'${value - 60}"`;
    } else {
      return `6'${value - 72}"`;
    }
  };

  const handleShoeCheck = (value) => {
    if (shoeArray.includes(value)) {
      setShoeArray(shoeArray.filter((size) => size !== value));
    } else {
      setShoeArray([...shoeArray, value]);
    }
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        className={classes.drawer}
        classes={{ paper: classes.drawerPaper }}
        variant="permanent"
        anchor="left"
      >
        <Typography className={classes.title} variant="h5">
          Model Database
        </Typography>
        <Button
          className={classes.drawerListItem}
          variant="outlined"
          onClick={() => setModal(true)}
        >
          Add Model
          <FaPlus className="ml-2" />
        </Button>
        <form className={classes.filterWrapper}>
          <TextField
            className={classes.drawerListItem}
            label="Model Search"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className={classes.drawerListItem}>
            <Typography>Age Range</Typography>
            <Slider
              value={ageRange}
              valueLabelDisplay="auto"
              onChange={(e, newVal) => setAgeRange(newVal)}
            />
          </div>
          <div className={classes.drawerListItem}>
            <Typography>Height Range</Typography>
            <Slider
              min={48}
              max={79}
              value={heightRange}
              valueLabelDisplay="auto"
              valueLabelFormat={heightFormat}
              onChange={(e, newVal) => setHeightRange(newVal)}
            />
          </div>
          <div className={classes.drawerListItem}>
            <Typography>Shoe Size</Typography>
            {[
              4,
              4.5,
              5,
              5.5,
              6,
              6.5,
              7,
              7.5,
              8,
              8.5,
              9,
              9.5,
              10,
              10.5,
              11,
              11.5,
              12,
            ].map((value) => (
              <FormControlLabel
                key={value}
                control={
                  <Checkbox
                    name={value}
                    onChange={() => handleShoeCheck(value)}
                    checked={shoeArray.includes(value)}
                  />
                }
                label={value}
              />
            ))}
          </div>
        </form>
      </Drawer>
      <main className={classes.content}>
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          className={classes.dropdownButton}
        >
          <FaPlus />
        </IconButton>
        <Menu
          className={classes.dropdown}
          open={anchorEl ? true : false}
          anchorEl={anchorEl}
          onClose={handleDropdownClose}
        >
          {attributes.map((att) => (
            <MenuItem
              key={att}
              onClick={() => {
                setCols([...cols, att]);
                handleDropdownClose();
              }}
            >
              {att[0].toUpperCase() + att.slice(1)}
            </MenuItem>
          ))}
        </Menu>
        <TableContainer className={classes.table} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {cols.map((col) => (
                  <TableCell key={col}>
                    <div className="d-flex align-items-center justify-content-between">
                      {col[0].toUpperCase() + col.slice(1)}
                      <FaMinusCircle
                        style={{ cursor: "pointer", color: "red" }}
                        onClick={() => {
                          setCols(cols.filter((c) => c !== col));
                        }}
                      />
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredModelsList
                ? filteredModelsList.map((model) => (
                    <TableRow
                      key={model._id}
                      onClick={() => handleModalOpen(model._id)}
                      className="border-none"
                    >
                      {cols.map((col) => {
                        if (col === "age") {
                          return (
                            <TableCell>
                              {model.ageMin}-{model.ageMax}
                            </TableCell>
                          );
                        } else if (col === "height") {
                          return (
                            <TableCell>
                              {model.heightFt}'{model.heightIn}"
                            </TableCell>
                          );
                        } else {
                          return (
                            <TableCell key={model._id + col}>
                              {model[col]}
                            </TableCell>
                          );
                        }
                      })}
                    </TableRow>
                  ))
                : ""}
            </TableBody>
          </Table>
        </TableContainer>
        <Modal open={modal} onClose={() => setModal(false)}>
          <div className={classes.modal}>
            <Paper className={classes.paper}>
              <Typography variant="h6">Add Model</Typography>
              <form onSubmit={handleModelAdd}>
                <Grid className={classes.formGrid} container spacing={3}>
                  <Grid item xs={4}>
                    <TextField
                      value={model.name}
                      label="Name"
                      name="name"
                      type="text"
                      helperText={nameHelper}
                      error={nameHelper.length}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      value={model.agency}
                      label="Agency"
                      name="agency"
                      type="text"
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Union?</FormLabel>
                      <RadioGroup
                        row
                        name="union"
                        value={model.union}
                        onChange={handleChange}
                      >
                        <FormControlLabel
                          value="yes"
                          control={<Radio />}
                          label="Y"
                        />
                        <FormControlLabel
                          value="no"
                          control={<Radio />}
                          label="N"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid className={classes.formGrid} container spacing={3}>
                  <Grid item xs={4}>
                    <TextField
                      label="Daytime Availability?"
                      value={model.daytime}
                      name="daytime"
                      type="text"
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl>
                      <FormLabel component="legend">Age Range</FormLabel>
                      <Grid>
                        <TextField
                          style={{ width: "35%" }}
                          className="mx-1"
                          value={model.ageMin}
                          name="ageMin"
                          type="number"
                          onChange={handleChange}
                        />
                        -
                        <TextField
                          style={{ width: "35%" }}
                          className="mx-1"
                          value={model.ageMax}
                          name="ageMax"
                          type="number"
                          onChange={handleChange}
                        />
                      </Grid>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl>
                      <FormLabel component="legend">Height</FormLabel>
                      <Grid>
                        <TextField
                          label="Feet"
                          style={{ width: "35%" }}
                          className="mx-1"
                          value={model.heightFt}
                          name="heightFt"
                          type="number"
                          onChange={handleChange}
                        />
                        <TextField
                          label="Inches"
                          style={{ width: "35%" }}
                          className="mx-1"
                          value={model.heightIn}
                          name="heightIn"
                          type="number"
                          onChange={handleChange}
                        />
                      </Grid>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid className={classes.formGrid} container spacing={3}>
                  <Grid item xs={4}>
                    <FormControl className={classes.formControl}>
                      <InputLabel>Hair Color</InputLabel>
                      <Select
                        value={model.hairColor}
                        name="hairColor"
                        onChange={handleChange}
                      >
                        <MenuItem value="blonde">Blonde</MenuItem>
                        <MenuItem value="brunette">Brunette</MenuItem>
                        <MenuItem value="red">Red</MenuItem>
                        <MenuItem value="black">Black</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Shoe Size"
                      value={model.shoe}
                      name="shoe"
                      type="number"
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl className={classes.formControl}>
                      <InputLabel>Size</InputLabel>
                      <Select
                        value={model.size}
                        name="size"
                        onChange={handleChange}
                      >
                        <MenuItem value="xs">XS</MenuItem>
                        <MenuItem value="s">S</MenuItem>
                        <MenuItem value="m">M</MenuItem>
                        <MenuItem value="l">L</MenuItem>
                        <MenuItem value="xl">XL</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid className={classes.formGrid} container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      multiline
                      fullWidth
                      label="Skills"
                      onChange={handleSkillsChange}
                      type="textarea"
                    />
                  </Grid>
                </Grid>
                <Grid className={classes.formGrid} container spacing={3}>
                  <Grid item xs={6}>
                    <TextField
                      label="Phone"
                      value={model.phone}
                      name="phone"
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Email"
                      value={model.email}
                      name="email"
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
                <Grid className={classes.formGrid} container spacing={3}>
                  <Grid item xs={6}>
                    <div>
                      <input
                        onChange={(e) => {
                          setImage(e.target.files[0]);
                        }}
                        id="image-upload"
                        type="file"
                        className={classes.input}
                        multiple
                        accept="image/*"
                      />
                      <label htmlFor="image-upload">
                        <Button variant="contained" component="span">
                          Upload Headshot
                        </Button>
                      </label>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <input
                      type="file"
                      name="resume"
                      className={classes.input}
                      onChange={(e) => {
                        setResume(e.target.files[0]);
                      }}
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload">
                      <Button variant="contained" component="span">
                        Upload Resume
                      </Button>
                    </label>
                  </Grid>
                </Grid>
                <Button variant="outlined" type="submit">
                  {formLoading ? <CircularProgress size={20} /> : 'Add Model'}
                </Button>
              </form>
            </Paper>
          </div>
        </Modal>
        <Modal
          disableAutoFocus={true}
          open={currentModal}
          onClose={() => setCurrentModal(false)}
        >
          <div className={classes.modal}>
            <Paper className={classes.paper}>
              <Grid container>
                <Grid item xs>
                  {currentModel.imageUrl.length ?
                  <img src={currentModel.imageUrl} className={classes.image} /> : 
                  ''}
                </Grid>
                <Grid item xs>
                  <Typography variant="h4" className={classes.typography}>
                    {currentModel.name}
                  </Typography>
                  {currentModel.heightFt !== 0 && currentModel.heightIn !== 0 ? <Typography variant="body1" className={classes.typography}>
                    <span className={classes.bold}>Height: </span>
                    {currentModel.heightFt}'{currentModel.heightIn}"
                  </Typography> : ''}
                  {currentModel.size.length ? <Typography variant="body1" className={classes.typography}>
                    <span className={classes.bold}>Athletic Size: </span>
                    {currentModel.size.toUpperCase()}
                  </Typography> : ''}
                  {currentModel.shoe !== 0 ? <Typography variant="body1" className={classes.typography}>
                    <span className={classes.bold}>Shoe Size: </span>
                    {currentModel.shoe}
                  </Typography> : ''}
                  {currentModel.ageMin !== 0 && currentModel.ageMax !== 0 ? <Typography variant="body1" className={classes.typography}>
                    <span className={classes.bold}>Age Range: </span>
                    {currentModel.ageMin}-{currentModel.ageMax}
                  </Typography> : ''}
                  {currentModel.agency.length ? <Typography variant="body1" className={classes.typography}>
                    <span className={classes.bold}>Agency: </span>
                    {currentModel.agency}
                  </Typography> : ''}
                  {currentModel.union.length ? <Typography variant="body1" className={classes.typography}>
                    <span className={classes.bold}>Union: </span>
                    {currentModel.union}
                  </Typography> : ''}
                  {currentModel.daytime.lengtht ? <Typography variant="body1" className={classes.typography}>
                    <span className={classes.bold}>Daytime Avail: </span>
                    {currentModel.daytime}
                  </Typography> : ''}
                  {currentModel.skills.length ? <Typography variant="body1" className={classes.typography}>
                    <span className={classes.bold}>Skills: </span>
                    {currentModel.skills.join(", ")}
                  </Typography> : ''}
                  {currentModel.email.length ? <Typography variant="body1" className={classes.typography}>
                    <span className={classes.bold}>Email: </span>
                    <a href={`mailto:${currentModel.email}`}>
                      {currentModel.email}
                    </a>
                  </Typography> : ''}
                  {currentModel.phone.length ? <Typography variant="body1" className={classes.typography}>
                    <span className={classes.bold}>Phone: </span>
                    <a href={`tel:${currentModel.phone}`}>
                      {currentModel.phone}
                    </a>
                  </Typography> : ''}
                  {currentModel.resumeUrl.length ? (
                    <Button href={currentModel.resumeUrl} variant="outlined">
                      Link to Resume
                    </Button>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
            </Paper>
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default PageContent;
