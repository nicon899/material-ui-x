import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import * as React from 'react';
import { columnLookupSelector } from '../../hooks/features/columns/columnsSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import {
  activeFilterItemsSelector,
  filterItemsCounterSelector,
} from '../../hooks/features/filter/filterSelector';
import { preferencePanelStateSelector } from '../../hooks/features/preferencesPanel/preferencePanelSelector';
import { PreferencePanelsValue } from '../../hooks/features/preferencesPanel/preferencesPanelValue';
import { useIcons } from '../../hooks/utils/useIcons';
import { optionsSelector } from '../../hooks/utils/useOptionsProp';
import { ApiContext } from '../api-context';

export const FilterToolbarButton: React.FC<{}> = () => {
  const apiRef = React.useContext(ApiContext);
  const options = useGridSelector(apiRef, optionsSelector);
  const counter = useGridSelector(apiRef, filterItemsCounterSelector);
  const activeFilters = useGridSelector(apiRef, activeFilterItemsSelector);
  const lookup = useGridSelector(apiRef, columnLookupSelector);
  const preferencePanel = useGridSelector(apiRef, preferencePanelStateSelector);

  const tooltipContentNode = React.useMemo(() => {
    if (preferencePanel.open) {
      return apiRef!.current.getLocaleText('toolbarFiltersTooltipHide') as React.ReactElement;
    }
    if (counter === 0) {
      return apiRef!.current.getLocaleText('toolbarFiltersTooltipShow') as React.ReactElement;
    }
    return (
      <div>
        {apiRef!.current.getLocaleText('toolbarFiltersTooltipActive')(counter)}
        <ul>
          {activeFilters.map((item) => ({
            ...(lookup[item.columnField!] && (
              <li key={item.id}>
                {lookup[item.columnField!].headerName || item.columnField} {item.operatorValue}{' '}
                {item.value}
              </li>
            )),
          }))}
        </ul>
      </div>
    );
  }, [apiRef, preferencePanel.open, counter, activeFilters, lookup]);

  const icons = useIcons();
  const filterIconElement = React.createElement(icons.OpenFilterButtonIcon!, {});
  const toggleFilter = React.useCallback(() => {
    const { open, openedPanelValue } = preferencePanel;
    if (open && openedPanelValue === PreferencePanelsValue.filters) {
      apiRef!.current.hideFilterPanel();
    } else {
      apiRef!.current.showFilterPanel();
    }
  }, [apiRef, preferencePanel]);

  if (options.disableColumnFilter) {
    return null;
  }

  return (
    <Tooltip title={tooltipContentNode} enterDelay={1000}>
      <Button
        onClick={toggleFilter}
        color="primary"
        aria-label={apiRef!.current.getLocaleText('toolbarFiltersLabel')}
        startIcon={
          <Badge badgeContent={counter} color="primary">
            {filterIconElement}
          </Badge>
        }
      >
        {apiRef!.current.getLocaleText('toolbarFilters')}
      </Button>
    </Tooltip>
  );
};
