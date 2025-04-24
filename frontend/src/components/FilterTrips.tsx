// src/components/FilterTrips.tsx
import React from 'react';

interface Props {
  selectedFilters: string[];
  selectedSort: string;
  sortDirection: 'asc'|'desc';
  onChange: (filters:string[], sort:string, dir:'asc'|'desc') => void;
}

const FilterTrips: React.FC<Props> = ({
  selectedFilters, selectedSort, sortDirection, onChange
}) => {
  const toggleFilter = (filter:string) => {
    const next = selectedFilters.includes(filter)
      ? selectedFilters.filter(f=>f!==filter)
      : [...selectedFilters,filter];
    onChange(next, selectedSort, sortDirection);
  };
  const setSort = (sort:string) => onChange(selectedFilters, sort, sortDirection);
  const setDir  = (dir:'asc'|'desc') => onChange(selectedFilters, selectedSort, dir);

  return (
    <div className="d-flex gap-2 flex-wrap mb-3 justify-content-center p-2">
      {['past','current','future'].map(f=>(
        <button key={f}
          onClick={()=>toggleFilter(f)}
          className="btn"
          style={{
            backgroundColor: selectedFilters.includes(f)?'#ACD3A8':'white',
            border:'1px solid #ACD3A8',
            borderRadius:'999px',
            padding:'0.4rem 1rem',
            textTransform:'capitalize'
          }}
        >{f}</button>
      ))}

      <div className="dropdown" style={{padding:'5px'}}>
        <button className="btn p-0 border-0 bg-transparent"
          type="button" data-bs-toggle="dropdown">
          <i className="fa-solid fa-filter fa-lg text-secondary"></i>
        </button>
        <div className="dropdown-menu p-3" style={{minWidth:200}} onClick={e=>e.stopPropagation()}>
          <div className="mb-2 fw-bold">Sort by:</div>
          {['Date Created','Date Modified','Trip Start Date'].map(label=>(
            <div className="form-check" key={label}>
              <input className="form-check-input" type="radio"
                name="sortOption" id={label}
                checked={selectedSort===label}
                onChange={()=> setSort(label)}
              />
              <label className="form-check-label" htmlFor={label}>{label}</label>
            </div>
          ))}

          <div className="d-flex justify-content-center mt-3">
            <button className={`btn btn-sm ${sortDirection==='asc'?'btn-secondary':'btn-outline-secondary'}`}
              onClick={()=>setDir('asc')} style={{margin:'3px'}}>Asc</button>
            <button className={`btn btn-sm ${sortDirection==='desc'?'btn-secondary':'btn-outline-secondary'}`}
              onClick={()=>setDir('desc')} style={{margin:'3px'}}>Desc</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterTrips;
