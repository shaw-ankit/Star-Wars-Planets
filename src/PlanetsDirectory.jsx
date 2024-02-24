import { useEffect, useState } from "react";

const listOfColor = [
  "red",
  "green",
  "orange",
  "blue",
  "pink",
  "tomato",
  "gray ",
  "skyblue",
  "violet",
  "lightgreen",
];

const PlanetsDirectory = () => {
  const [planets, setPlanets] = useState([]);
  const [nextPlanets, setNextPlanets] = useState("");
  const [previousPlanets, setPerviousPlanets] = useState("");
  const [residentDetails, setResidentDetails] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState("");
  const [loading,setLoading] = useState(false);
  const [residentloading,setResidentLoading] = useState(false);
  
  const fetchDetails = (url) =>fetch(url).then((res) => res.json());
  
  const getAllResidents = (residents) => {
    setResidentLoading(true)
    Promise.all(residents.map(fetchDetails))
      .then(setResidentDetails)
      .catch(console.error)
      .finally(() => setResidentLoading(false));
  };
  //Fetching the planets api
  async function fetchPlanets(Url) {
    setLoading(true)
    try {
      const data = await fetchDetails(Url);
      setPlanets(data.results);
      setNextPlanets(data.next);
      setPerviousPlanets(data.previous);
      setLoading(false)
      console.log(data);
    } catch (error) {
      console.error("Planets data is not fetch", error);
    }
  }
  useEffect(() => {
    fetchPlanets("https://swapi.dev/api/planets/?format=json");
  }, []);

  if (loading) return <div className="home-loader"></div>
  

  return (
    <>
      { residentloading && <div className="loader"></div>}
      <div className="container">
        <h1>Star Wars Planets</h1>
        <div className="card-wrapper">
          {planets.map((planet, index) => {
            const color = listOfColor[index];
            const eleStyle = { background: color };
            return (
              <div key={index} className="planet-card">
                <div style={eleStyle} className="circle">
                  <h3>{planet.name}</h3>
                </div>
                <div className="content">
                  <h6>POPULATION: {planet.population}</h6>
                  <h6>CLIMATE: {planet.climate}</h6>
                  <h6>TERRAIN: {planet.terrain}</h6>
                </div>
                
                {planet.residents.length > 0 ? (
                  <div className="button">
                    <button
                      style={eleStyle}
                      onClick={() => {
                        setSelectedPlanet(planet.name);
                        getAllResidents(planet.residents);
                      }}
                      >
                      View Residents
                    </button>
                  </div>
                ) : (
                  <div className="no-data">No residents found.</div>
                )}
                {planet.name === selectedPlanet &&
                  residentDetails.length > 0 && (
                    <div style={eleStyle} className="residents">
                      {residentDetails.map((each) => (
                        <div key={each.name} className="resident-data">
                          <div className="box">
                            <p>Name: {each.name}</p>
                            <p>Height: {each.height} cm</p>
                            <p>Mass: {each.mass} kg</p>
                            <p>Gender: {each.gender}</p>
                          </div>
                          <hr />
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            );
          })}
        </div>
        <div className="pagination">
          {previousPlanets && (
            <button className="previous" onClick={() => fetchPlanets(previousPlanets)}>
              Previous
            </button>
          )}
          {nextPlanets && (
            <button className="next" onClick={() => fetchPlanets(nextPlanets)}>Next</button>
          )}
        </div>
      </div>
    </>
  );
};

export default PlanetsDirectory;
