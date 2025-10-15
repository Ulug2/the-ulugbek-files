import { useEffect, useState } from 'react';

function VisitCounter() {
  const [visits, setVisits] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/visit`)
      .then(res => res.json())
      .then(data => setVisits(data.visits))
      .catch(err => console.error('Error fetching visit count:', err));
  }, []);

  return (
    <div className="visit-box">
      <div className="visit-box__header">Visitor Counter</div>
      <div className="visit-box__body">
        {visits !== null
          ? <span>You are <strong>{visits}</strong>th visitor</span>
          : <span>Loading visitor count...</span>}
      </div>
    </div>
  );
}

export default VisitCounter;