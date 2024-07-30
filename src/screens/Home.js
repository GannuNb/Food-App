import React, { useEffect, useState } from 'react';
import Card from './Card';
import Carousel from '../components/Carousel';

export default function Home() {
  const [search,setSearch]=useState('')
  const [foodCat, setFoodCat] = useState([]);
  const [foodItems, setFoodItems] = useState([]);

  const loadData = async () => {
    try {
      let response = await fetch('http://localhost:5000/api/foodData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      response = await response.json();

      setFoodCat(response[1]);
      setFoodItems(response[0]);
      // console.log(response[0], response[1]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
            <div>
            <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
                <div className="carousel-inner" id="carousel">
                    <div className="carousel-caption" style={{ zIndex: "9" }}>
                        <form className="d-flex justify-content-center">
                            <input className="form-control me-2 w-75 bg-white text-dark" type="search" placeholder="Type in..." aria-label="Search" value={search} onChange={(e)=>{setSearch(e.target.value)}}/>
                            <button className="btn text-white bg-success" type="submit">Search</button>
                        </form>
                    </div>
                    <div className="carousel-item active">
                        <img src="https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="d-block w-100" style={{ filter: "brightness(30%)" }} alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src="https://images.unsplash.com/photo-1430163393927-3dab9af7ea38?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="d-block w-100 h-50" style={{ filter: "brightness(30%)" }} alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src="https://plus.unsplash.com/premium_photo-1663852297267-827c73e7529e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="d-block w-100" style={{ filter: "brightness(30%)" }} alt="..." />
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    



        <div className="m-3">
  {foodCat.length > 0 ? (
    foodCat.map((data) => {
      return (
        <div className="row mb-3" key={data._id}>
          <div className="fs-3 m-3">{data.CategoryName}</div>
          <hr />
          {foodItems.length > 0 ? (
            foodItems
              .filter(
                (item) =>
                  item.CategoryName === data.CategoryName &&
                  item.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((filterItems) => (
                <div key={filterItems._id} className="col-12 col-md-6 col-lg-3 col-sm-6">



                  <Card foodItem={filterItems}

                    // foodName={filterItems.name}
                    options={filterItems.options[0]}
                    // ImgSrc={filterItems.img}
                  />
                </div>
              ))
          ) : (
            <div>No such data found</div>
          )}
        </div>
      );
    })
  ) : (
    <div>......</div>
  )}
</div>

    </>
  );
}
