var defaultConfig = {
  openPopouts: [],
  settings: {
    hasHeaders: true,
    constrainDragToContainer: true,
    reorderEnabled: true,
    selectionEnabled: false,
    popoutWholeStack: false,
    blockedPopoutsThrowError: true,
    closePopoutsOnUnload: true,
    showPopoutIcon: false,
    showMaximiseIcon: false,
    showCloseIcon: false,
    responsiveMode: 'onload',
    // Can be onload, always, or none.
    tabOverlapAllowance: 0,
    // maximum pixel overlap per tab
    reorderOnTabMenuClick: true,
    tabControlOffset: 10
  },
  dimensions: {
    borderWidth: 2,
    borderGrabWidth: 9,
    minItemHeight: 10,
    minItemWidth: 10,
    headerHeight: 20,
    dragProxyWidth: 300,
    dragProxyHeight: 200
  },
  labels: {
    close: 'close',
    maximise: 'maximise',
    minimise: 'minimise',
    popout: 'open in new window',
    popin: 'pop in',
    tabDropdown: 'additional tabs'
  }
};
export default defaultConfig;