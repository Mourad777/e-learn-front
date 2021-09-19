import React,{useState} from "react";
import classes from "./SearchBar.module.css";

export default function SearchBar(props) {
  const [selectedIcon, setSelectedIcon] = React.useState(0);

  return (
    <div className={classes.search}>
       <input type="text" className={classes.searchTerm} placeholder="What are you looking for?"/>
       <button type="submit" className={classes.searchButton}>
         <i className="fa fa-search"></i>
      </button>
    </div>
  );
}
