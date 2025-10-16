import './Examheader.css';
import logo from "../../../assets/logo.png";


const ExamHeader=()=> {
  return (
<header className="header">
  <span className="logo-wrapper">
    <img src={logo} alt="Company Logo" className="logo" />
   
  </span>
  <span>
    <h1 style={{ color: 'darkblue' }}>GMAT&trade; Diagnostic Test</h1>
    {/* <p style={{ color: 'black' }}>GMAT&trade; 2025 Test</p> */}
  </span>
</header>


  );
};


export default ExamHeader;
