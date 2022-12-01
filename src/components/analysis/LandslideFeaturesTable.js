import React, {Fragment, useState, useEffect, useRef, createRef} from 'react';

import MUIDataTable from 'mui-datatables';
import {Grid, Paper, Hidden} from '@material-ui/core';

const moms_features_data = [
  ['Crack', 'F', 'Near School', '17 July 2022, 11:30', 0, 12],
];

const moms_reports = [
  [
    '17 July 2022, 11:30',
    'Entry entered to close Mx trigger->M0; assumed timestamp of observance',
    '17 July 2022, 11:30',
    'Dynaslope Senslope',
    'Kevin Dhale Dela Cruz',
    'Entry entered to close Mx trigger->M0; assumed timestamp of observance',
    0,
  ],
  [
    '17 July 2022, 07:30',
    'new crack found near LAYSB',
    '17 July 2022, 07:30',
    'Dynaslope Senslope',
    'Rodney Estrada',
    'New landslide feature observed in the crown and toe area of the site which indicate active and significant ground movement',
    2,
  ],
];

function LandslideFeaturesTable(props) {
  const [moms_features, setMOMsFeatures] = useState(moms_features_data);
  const [open_reports, setOpenReports] = useState(false);

  const columns = [
    'Type',
    {
      name: 'Name',
      options: {
        filter: false,
      },
    },
    {
      name: 'Location',
      options: {
        filter: false,
      },
    },
    {
      name: 'Last Observance Timestamp',
      options: {
        filter: false,
      },
    },
    'Alert Level',
    {
      name: 'data',
      options: {
        display: false,
        viewColumns: false,
        filter: false,
      },
    },
  ];

  const report_columns = [
    'Observance Timestamp',
    'Narrative',
    'Report Timestamp',
    'Reporter',
    'Validator',
    'Remarks',
    'Alert Level',
  ];

  return (
    <Fragment>
      <Paper style={{marginTop: 30}}>
        <MUIDataTable
          key="landslide_features"
          title={`Landslide Features of MAR`}
          columns={columns}
          options={{
            textLabels: {
              body: {
                noMatch: 'No data',
              },
            },
            selectableRows: 'none',
            rowsPerPage: 5,
            rowsPerPageOptions: [],
            print: false,
            download: false,
            responsive: 'standard',
            onRowClick(data, meta, e) {
              console.log(data);
              setOpenReports(!open_reports);
            },
          }}
          data={moms_features}
        />
        {open_reports && (
          <Fragment key="landslide_data">
            <div style={{marginTop: 30}}>
              <MUIDataTable
                title={`Landslide reports for Crack F`}
                columns={report_columns}
                options={{
                  textLabels: {
                    body: {
                      noMatch: 'No data',
                    },
                  },
                  selectableRows: 'none',
                  rowsPerPage: 5,
                  rowsPerPageOptions: [],
                  print: false,
                  download: false,
                  responsive: 'standard',
                  // onRowClick(data, meta, e) {
                  //     console.log(data)
                  //     setOpenReports(!open_reports)
                  // }
                }}
                data={moms_reports}
              />
            </div>
          </Fragment>
        )}
      </Paper>
    </Fragment>
  );
}

export default LandslideFeaturesTable;
