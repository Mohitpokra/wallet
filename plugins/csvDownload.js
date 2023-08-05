// plugins/csvDownload.js

import Papa from 'papaparse';

export default ({ app }, inject) => {
  inject('csvDownload', data => {
    const csv = Papa.unparse(data);

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};
