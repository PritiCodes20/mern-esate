import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaBed, FaBath, FaTag } from 'react-icons/fa';

export default function ListingItem({ listing }) {
  return (
    <div className='bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col w-full group'>
      <Link to={`/listing/${listing._id}`} className='relative overflow-hidden'>
        <img
          src={
            listing.imageUrls[0] ||
            'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'
          }
          alt='listing cover'
          className='h-[220px] sm:h-[240px] w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out'
        />

        <div className='absolute top-3 left-3 flex flex-wrap gap-1.5'>
          <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-md text-white ${
            listing.type === 'rent' ? 'bg-blue-600' : 'bg-indigo-600'
          }`}>
            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
          {listing.offer && (
            <span className='px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-md bg-emerald-500 text-white flex items-center gap-1'>
              <FaTag className='text-[9px]' /> Offer
            </span>
          )}
        </div>
      </Link>

      <div className='p-5 flex flex-col justify-between flex-grow gap-3'>
        <div>
          <div className='flex items-baseline gap-1'>
            <p className='text-xl font-extrabold text-blue-600'>
              $
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
            </p>
            {listing.type === 'rent' && (
              <span className='text-xs text-slate-400 font-medium'>/ month</span>
            )}
          </div>

          <Link to={`/listing/${listing._id}`}>
            <h3 className='font-bold text-slate-800 text-base line-clamp-1 mt-1 group-hover:text-blue-600 transition-colors'>
              {listing.name}
            </h3>
          </Link>

          <div className='flex items-center gap-1.5 mt-2 text-slate-500 text-xs'>
            <MdLocationOn className='text-emerald-500 text-base flex-shrink-0' />
            <p className='truncate'>{listing.address}</p>
          </div>

          <p className='text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed'>
            {listing.description}
          </p>
        </div>

        <div className='pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium'>
          <div className='flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100'>
            <FaBed className='text-slate-400 text-sm' />
            <span>{listing.bedrooms} {listing.bedrooms > 1 ? 'Beds' : 'Bed'}</span>
          </div>

          <div className='flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100'>
            <FaBath className='text-slate-400 text-sm' />
            <span>{listing.bathrooms} {listing.bathrooms > 1 ? 'Baths' : 'Bath'}</span>
          </div>

          <Link
            to={`/listing/${listing._id}`}
            className='text-xs font-bold text-blue-600 hover:text-blue-700 underline underline-offset-2'
          >
            Details →
          </Link>
        </div>
      </div>
    </div>
  );
}