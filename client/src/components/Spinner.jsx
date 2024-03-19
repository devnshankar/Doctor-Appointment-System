import "../styles/SpinnerStyles.css"

const Spinner = () => {
  return (
    <div
      className="spinner-container d-flex justify-content-center spinner"
      style={{ backgroundColor: "#002132" }}
    >
      <img style={{width: '80px'}} src="/doctorbuddy-logo.png"></img>
    </div>
  );
};

export default Spinner;
