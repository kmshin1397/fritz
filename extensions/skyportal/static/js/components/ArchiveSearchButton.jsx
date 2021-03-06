import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

import { showNotification } from "baselayer/components/Notifications";
import * as archiveActions from "../ducks/archive";

const ArchiveSearchButton = ({ ra, dec, radius = 3 }) => {
  const dispatch = useDispatch();
  const catalogNames = useSelector((state) => state.catalog_names);

  useEffect(() => {
    const fetchCatalogNames = () => {
      const data = dispatch(archiveActions.fetchCatalogNames());
    };
    if (!catalogNames) {
      fetchCatalogNames();
    }
  }, [catalogNames, dispatch]);

  const ZTFLightCurveCatalogNames = catalogNames?.filter(
    (name) => name.indexOf("ZTF_sources") !== -1
  );
  const catalog = ZTFLightCurveCatalogNames[0];

  const handleClick = () => {
    if (catalog) {
      dispatch(
        archiveActions.fetchZTFLightCurves({ catalog, ra, dec, radius })
      );
      dispatch(archiveActions.fetchNearestSources({ ra, dec }));
    } else {
      dispatch(
        showNotification(
          "Catalog names could not be fetched; enter search criteria manually",
          "warning"
        )
      );
    }
  };

  return (
    <Link to="/archive" onClick={handleClick}>
      <Button variant="contained" size="small">Search ZTF Light Curve Archive</Button>
    </Link>
  );
};

ArchiveSearchButton.propTypes = {
  objID: PropTypes.string.isRequired,
  ra: PropTypes.number.isRequired,
  dec: PropTypes.number.isRequired,
  radius: PropTypes.number,
};
ArchiveSearchButton.defaultProps = {
  radius: 3,
};

export default ArchiveSearchButton;
