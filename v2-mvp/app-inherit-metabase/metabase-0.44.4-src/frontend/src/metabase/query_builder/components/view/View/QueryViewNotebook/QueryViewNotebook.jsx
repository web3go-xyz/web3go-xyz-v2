import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Notebook from "metabase/query_builder/components/notebook/Notebook";
import { NotebookContainer } from "./QueryViewNotebook.styled";

const delayBeforeNotRenderingNotebook = 10;

const QueryViewNotebook = ({ isNotebookContainerOpen, ...props }) => {
  const [shouldShowNotebook, setShouldShowNotebook] = useState(
    isNotebookContainerOpen,
  );

  useEffect(() => {
    isNotebookContainerOpen && setShouldShowNotebook(isNotebookContainerOpen);
  }, [isNotebookContainerOpen]);

  const handleTransitionEnd = event => {
    if (event.propertyName === "opacity" && !isNotebookContainerOpen) {
      setShouldShowNotebook(false);
    }
  };

  return (
    shouldShowNotebook ? (<NotebookContainer
      isOpen={isNotebookContainerOpen}
      transitionTime={delayBeforeNotRenderingNotebook}
      onTransitionEnd={handleTransitionEnd}
    >
      {<Notebook {...props} />}
    </NotebookContainer>) : null

  );
};

QueryViewNotebook.propTypes = {
  isNotebookContainerOpen: PropTypes.bool.isRequired,
};

export default QueryViewNotebook;
