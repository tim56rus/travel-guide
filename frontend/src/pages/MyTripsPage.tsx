// src/pages/MyTripsPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchTrips from '../components/SearchTrips';
import TripsGrid from '../components/TripsGrid';
import PlanTrip   from '../components/PlanTrip';
import FilterTrips from '../components/FilterTrips';

const MyTripsPage: React.FC = () => {
  const navigate = useNavigate();
  const [trips, setTrips]               = useState<any[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<any[]>([]);
  const [filters, setFilters]           = useState<string[]>([]);
  const [sortBy, setSortBy]             = useState<string>('Date Created');
  const [sortDir, setSortDir]           = useState<'asc'|'desc'>('desc');
  const [searchActive, setSearchActive] = useState(false);
  const [showPopup, setShowPopup]       = useState(false);
  const [loading, setLoading]           = useState(true);

  const fetchTrips = useCallback(async () => {
    const res = await fetch('/api/searchTrips', { credentials:'include' });
    const json = await res.json();
    if (res.ok && json.data) {
      setTrips(json.data);
      setSearchActive(false);
    }
  }, []);

  // initial load
  useEffect(() => {
    fetchTrips().finally(()=>setLoading(false));
  }, [fetchTrips]);

  // session guard
  useEffect(() => {
    fetch('/api/checkSession',{credentials:'include'})
      .then(r=>r.json()).then(d=>{
        if (!d.userId) navigate('/login',{replace:true});
      });
  }, [navigate]);

  // whenever trips or filters/sort change, recompute
  useEffect(() => {
    const today = new Date();
    today.setHours(0,0,0,0);

    // bucket them
    let out = trips.filter(trip => {
      if (filters.length === 0) return true;
      // parse to local date
      const start = new Date(trip.startDate.split('T')[0]);
      const end   = new Date(trip.endDate.split('T')[0]);

      const isPast    = end   < today;
      const isCurrent = start <= today && today <= end;
      const isFuture  = start > today;

      // if any selected bucket matches, keep
      return filters.some(f => {
        if (f === 'past')    return isPast;
        if (f === 'current') return isCurrent;
        if (f === 'future')  return isFuture;
        return false;
      });
    });

    // sorting
    const getKey = (t:any) => {
      switch(sortBy) {
        case 'Date Modified':   return new Date(t.updatedAt);
        case 'Trip Start Date': return new Date(t.startDate);
        default:                return new Date(t.createdAt);
      }
    };
    out = out.sort((a,b)=>{
      const aK = getKey(a).getTime(), bK = getKey(b).getTime();
      return sortDir==='asc' ? aK - bK : bK - aK;
    });

    setFilteredTrips(out);
  }, [trips, filters, sortBy, sortDir]);

  if (loading) return <div className="text-center mt-10">Loading…</div>;

  return (
    <div style={{backgroundColor:'#F6F1DE',minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      <Header/>

      <div style={{flex:1,overflowY:'auto'}}>
        <h1 className="text-center display-1 pt-3" style={{fontWeight:300}}>My Trips</h1>

        <SearchTrips
          onSearch={results => {
            setFilteredTrips(results);
            setSearchActive(true);
          }}
        />

        <FilterTrips
          selectedFilters={filters}
          selectedSort={sortBy}
          sortDirection={sortDir}
          onChange={(f, s, d) => {
            setFilters(f);
            setSortBy(s);
            setSortDir(d);
          }}
        />

        <TripsGrid trips={filteredTrips} onAddTrip={()=>setShowPopup(true)}/>

        {searchActive && filteredTrips.length===0 && (
          <div className="text-center p-4">No trips found…</div>
        )}

        {showPopup && (
          <PlanTrip
            onClose={()=>setShowPopup(false)}
            onSearch={fetchTrips}
          />
        )}
      </div>
    </div>
  );
};

export default MyTripsPage;
