import algoliasearch from 'algoliasearch/lite';

export const searchClient = algoliasearch(
    'testingHHJZ8341BW',
    '0071873edbe8d1409d072ef90f3ff8a0'
);
  
export const client = searchClient.initIndex("drupalspeakers");
export const clientTypes = searchClient.initIndex("drupalspeakers-name-asc");