import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className='flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200'>
      {/* Sidebar Filter */}
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 w-full md:w-96'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-7'>
          <div>
            <label className='block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2'>
              Search Keyword
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Location, apartment...'
              className='border border-slate-200 dark:border-slate-700 rounded-xl p-3 w-full text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className='block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2'>
              Property Type
            </label>
            <div className='flex flex-wrap gap-4 text-sm font-medium'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  id='all'
                  className='w-4 h-4 text-blue-600 rounded'
                  onChange={handleChange}
                  checked={sidebardata.type === 'all'}
                />
                <span>Rent & Sale</span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  id='rent'
                  className='w-4 h-4 text-blue-600 rounded'
                  onChange={handleChange}
                  checked={sidebardata.type === 'rent'}
                />
                <span>Rent</span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  id='sale'
                  className='w-4 h-4 text-blue-600 rounded'
                  onChange={handleChange}
                  checked={sidebardata.type === 'sale'}
                />
                <span>Sale</span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  id='offer'
                  className='w-4 h-4 text-blue-600 rounded'
                  onChange={handleChange}
                  checked={sidebardata.offer}
                />
                <span>Offer</span>
              </label>
            </div>
          </div>

          <div>
            <label className='block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2'>
              Amenities
            </label>
            <div className='flex flex-wrap gap-4 text-sm font-medium'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  id='parking'
                  className='w-4 h-4 text-blue-600 rounded'
                  onChange={handleChange}
                  checked={sidebardata.parking}
                />
                <span>Parking</span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  id='furnished'
                  className='w-4 h-4 text-blue-600 rounded'
                  onChange={handleChange}
                  checked={sidebardata.furnished}
                />
                <span>Furnished</span>
              </label>
            </div>
          </div>

          <div>
            <label className='block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2'>
              Sort By
            </label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='border border-slate-200 dark:border-slate-700 rounded-xl p-3 w-full text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none'
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to high</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>

          <button className='bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-xl uppercase text-sm tracking-wider shadow-lg shadow-blue-600/30 transition-all cursor-pointer'>
            Apply Filters
          </button>
        </form>
      </div>

      {/* Results Listings */}
      <div className='flex-1 p-7'>
        <h1 className='text-2xl font-bold text-slate-800 dark:text-white pb-4 border-b border-slate-200 dark:border-slate-800'>
          All Properties ({listings.length})
        </h1>
        <div className='p-4 sm:p-7 flex flex-wrap gap-6'>
          {!loading && listings.length === 0 && (
            <p className='text-lg text-slate-500 dark:text-slate-400'>No properties found matching your criteria!</p>
          )}
          {loading && (
            <p className='text-lg text-slate-500 dark:text-slate-400 text-center w-full'>Loading properties...</p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <div key={listing._id} className='w-full sm:w-[320px]'>
                <ListingItem listing={listing} />
              </div>
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className='text-blue-600 dark:text-blue-400 font-bold hover:underline p-7 text-center w-full'
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}