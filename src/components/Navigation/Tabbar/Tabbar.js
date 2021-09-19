import React, { useEffect, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";
import { matchPath,useLocation, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { getRoutes } from "../../../routes";

const Tabbar = ({
    selectedCourse,
    loadedUser,
    width,
}) => {
    const isAccountActivated = (loadedUser||{}).isAccountActivated
    const routes = getRoutes(selectedCourse)
    const { t } = useTranslation("common")
    const history = useHistory()
    const currentRoute = useLocation().pathname
    const [tab, setTab] = useState(0);
    const [tabLabels, setTabLabels] = useState([]);
    const handleTabChange = (e, newValue,) => {
        if(newValue === tab)return;
        history.push(tabLabels[newValue].route)
    }
    useEffect(() => {
        routes.forEach(r => {
            const match = matchPath(currentRoute, {
                path: r.path,
                exact: true,
            });
            if (match) {
                setTabLabels(r.tabs||[])
                setTab(r.tab)
            }
        })

    }, [currentRoute,selectedCourse])
    if(!(tabLabels.length > 0)) return null;
    if(!isAccountActivated) return null;
    return (
        <AppBar
            position="static"
            color="default"
            style={width <= 500 ?{ position:'fixed',bottom:0 } : {}}
        >
            <Tabs
                centered
                value={tab}
                onChange={(e, newValue) => handleTabChange(e, newValue)}
                scrollButtons="on"
                indicatorColor="primary"
                textColor="primary"
                aria-label="scrollable force tabs example"

            >
                {tabLabels.map(tb => (
                    <Tab
                        key={tb.name}
                        // onClick={() => handleRoute(tab.route)}
                        
                        label={
                            <Typography style={width <= 500 ? {fontSize:'0.7rem'} : {}} >
                                {/* <Typography className={width < 500 ? classes.smallFontSize : ""}> */}
                                {t(
                                    `layout.tabBar.${tb.name
                                        .replace(" ", "")
                                        .toLowerCase()}`
                                )}
                            </Typography>
                        }
                        disabled={tb.disabled}
                    />))}
            </Tabs>
        </AppBar>
    );
};

const mapStateToProps = (state) => {
    return {
        selectedCourse:state.common.selectedCourse,
        loadedUser:state.authentication.loadedUser,
        width:state.common.width,
    }
}

export default connect(mapStateToProps)(Tabbar)