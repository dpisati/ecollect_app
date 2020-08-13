import React, { useEffect, useState, ChangeEvent, FormEvent, MouseEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import axios from "axios";
import api from "../../services/api";
import logo from "../../assets/logo.png";
import Dropzone from '../../components/Dropzone';
import "./styles.css";

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Address {
  id: number;
  a: string;
}

interface FinalAddressRes {
  address: FinalAddress;
}
interface FinalAddress {
  full: string;
  city: string;
  region: string;
  postcode: string;
  suburb: string;
  x: string;
  y: string;
}

interface RootObject {
  matched: number;
  addresses: Address[];
  badwords: any[];
  q?: any;
}


interface cityResponse {
  nome: string;
}


const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [address, setAddress] = useState<string[]>([]);
  const [region, setRegion] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [initialPosition, setinitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    suburb: "",
    city: "",
    region: "",
    postcode: "",
    latitude: "",
    longitude: ""
  });

  const [selectedRegion, setSelectedRegion] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [selectedFile, setSelectedFile] = useState<File>();
  const history = useHistory();

   useEffect(() => {
    api.get("items").then((response) => {
      setItems(response.data);
    });
  }, []);

  //  useEffect(() => {
  //   axios
  //     .get<nameResponse[]>(
  //       "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
  //     )
  //     .then((response) => {
  //       const regionNames = response.data.map((name) => name.sigla);
  //       setRegion(regionNames);
  //     });
  // }, []);

  useEffect(() => {
    if (selectedRegion === "0") {
      return;
    }
    axios
      .get<cityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedRegion}/municipios`
      )
      .then((response) => {
        const cityNames = response.data.map((city) => city.nome);
        setCities(cityNames);
      });
  }, [selectedRegion]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setinitialPosition([latitude, longitude]);
    });
  }, []);

  function handleSelectAddress(event: MouseEvent<HTMLOptionElement>) {
    event.preventDefault();    
    setAddress([""]);
    console.log(event.currentTarget.value);
    axios
    .get<FinalAddressRes>(
      `https://api.addy.co.nz/validation?key=c5d5722efb924aad9588470812c3d3ef&address=${event.currentTarget.value}`
    )
    .then((response) => {
        const addressOptions = response.data.address;
        console.log(addressOptions);
    });
    setFormData({
      ...formData,
      address: event.currentTarget.value,
    });
    
  }

  function handleInputAddress(event: ChangeEvent<HTMLInputElement>) {
    const addressInput = event.target.value;
    if (addressInput.length > 3) {
      axios
      .get<RootObject>(
        `https://api.addy.co.nz/search?key=c5d5722efb924aad9588470812c3d3ef&s=${addressInput}`
      )
      .then((response) => {
          const addressOptions = response.data.addresses.map((address) => address.a);
          setAddress(addressOptions);
      });
    }
    
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex((item) => item === id);
    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }
  // function handleSelectedRegion(event: ChangeEvent<HTMLSelectElement>) {
  //   const region = event.target.value;
  //   setSelectedRegion(region);
  // }
  // function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
  //   const city = event.target.value;
  //   setSelectedCity(city);
  // }
  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  }
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const { name, email, address, phone, latitude, longitude, suburb, city, region, postcode  } = formData;
    // const uf = selectedRegion;
    // const city = selectedCity;
    // const [latitude, longitude] = selectedPosition;
    const items = selectedItems;
    
    const data = new FormData();
      data.append('name', name);
      data.append('email', email);
      data.append('phone', phone);
      data.append('latitude', String(latitude));
      data.append('longitude', String(longitude));
      data.append('address', address);
      data.append('suburb', suburb);
      data.append('city', city);
      data.append('region', region);
      data.append('postcode', postcode);
      data.append('items', items.join(','));
      if (selectedFile) {
        data.append('image', selectedFile);
      } 
    
    await api.post("points", data);
    history.push("/success");
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="ecolect" />
        <Link to="/">
          <FiArrowLeft />
          Back to home
        </Link>
      </header>
      <form onSubmit={handleSubmit}>
        <h1>Create new collect point</h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                name="phone"
                id="phone"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Address</h2>
            <span>Type the address on the field below</span>
          </legend>
          <div className="field-group">
            <div className="field">
              <label htmlFor="address"></label>
              <input id="addressInput" type="text" className="field address-main" name="address" placeholder="Type your address..." onChange={handleInputAddress} />

              <div>
                
                {address.map((address) => (
                  <option key={address} value={address} className={address.length === 0 ? "" : "address-option"} onClick={handleSelectAddress}>
                    {address}
                  </option>
                ))
                }
              </div>


            </div>



          </div>
          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Items</h2>
            <span>Select one or more items below</span>
          </legend>
          <ul className="items-grid">
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? "selected" : ""}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default CreatePoint;
