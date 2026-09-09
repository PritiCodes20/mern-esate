import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import { 
  FaSearch, 
  FaStar, 
  FaArrowRight,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaShieldAlt,
  FaHandshake,
  FaKey
} from 'react-icons/fa';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?searchTerm=${searchTerm}`);
  };

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div className='bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen transition-colors duration-200'>
      {/* 1. HERO BANNER */}
      <div className='relative w-full h-[500px] sm:h-[560px] flex items-center px-6 sm:px-16 overflow-hidden bg-slate-900'>
        <img
          src='https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1920&q=80'
          alt='Suburban homes'
          className='absolute inset-0 w-full h-full object-cover opacity-50'
        />

        <div className='relative z-10 max-w-3xl w-full'>
          <h1 className='text-4xl sm:text-6xl font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-md'>
            Find the right home<br />at the right price
          </h1>

          <form
            onSubmit={handleSearch}
            className='mt-8 bg-white dark:bg-slate-900 rounded-xl p-1.5 sm:p-2 shadow-2xl flex items-center max-w-xl border border-transparent dark:border-slate-700'
          >
            <input
              type='text'
              placeholder='Enter an address, neighborhood, city, or ZIP code'
              className='w-full px-4 py-2 text-slate-800 dark:text-white bg-transparent text-sm sm:text-base focus:outline-none placeholder-slate-400'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type='submit'
              className='p-3 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors'
            >
              <FaSearch className='text-base' />
            </button>
          </form>
        </div>
      </div>

      {/* 2. PROPERTY LISTINGS SECTION */}
      <div className='max-w-7xl mx-auto px-6 py-16 flex flex-col gap-14'>
        {/* Recent Offers */}
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className='flex justify-between items-end mb-6'>
              <div>
                <span className='text-blue-600 dark:text-blue-400 font-semibold text-xs tracking-wider uppercase'>Featured Selection</span>
                <h2 className='text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white'>Recent Offers</h2>
              </div>
              <Link to='/search?offer=true' className='text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1'>
                Show more offers <FaArrowRight className='text-xs' />
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* Places for Rent */}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className='flex justify-between items-end mb-6'>
              <div>
                <span className='text-blue-600 dark:text-blue-400 font-semibold text-xs tracking-wider uppercase'>Rental Homes</span>
                <h2 className='text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white'>Places for Rent</h2>
              </div>
              <Link to='/search?type=rent' className='text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1'>
                Show more rentals <FaArrowRight className='text-xs' />
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* Places for Sale */}
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className='flex justify-between items-end mb-6'>
              <div>
                <span className='text-blue-600 dark:text-blue-400 font-semibold text-xs tracking-wider uppercase'>Buy Properties</span>
                <h2 className='text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white'>Places for Sale</h2>
              </div>
              <Link to='/search?type=sale' className='text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1'>
                Show more sales <FaArrowRight className='text-xs' />
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. HOW IT WORKS */}
      <div className='bg-slate-50 dark:bg-slate-900 py-16 border-t border-b border-slate-200 dark:border-slate-800 transition-colors'>
        <div className='max-w-7xl mx-auto px-6 text-center'>
          <span className='text-blue-600 dark:text-blue-400 font-bold text-xs tracking-widest uppercase'>Simple & Easy</span>
          <h2 className='text-3xl font-bold text-slate-800 dark:text-white mt-1'>How HomeHorizon Works</h2>
          <p className='text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-xl mx-auto'>
            From browsing to keys in hand, we make your real estate journey effortless in 3 simple steps.
          </p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-12'>
            <div className='bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center'>
              <div className='w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl mb-4'>
                <FaSearch />
              </div>
              <h3 className='font-bold text-lg text-slate-800 dark:text-white'>1. Discover Properties</h3>
              <p className='text-slate-500 dark:text-slate-400 text-xs mt-2 leading-relaxed'>
                Use our modern smart search to filter verified properties, neighborhoods, and price ranges.
              </p>
            </div>

            <div className='bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center'>
              <div className='w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl mb-4'>
                <FaHandshake />
              </div>
              <h3 className='font-bold text-lg text-slate-800 dark:text-white'>2. Connect with Agent</h3>
              <p className='text-slate-500 dark:text-slate-400 text-xs mt-2 leading-relaxed'>
                Schedule a house tour or chat directly with top verified property owners and local agents.
              </p>
            </div>

            <div className='bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center'>
              <div className='w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mb-4'>
                <FaKey />
              </div>
              <h3 className='font-bold text-lg text-slate-800 dark:text-white'>3. Move In Securely</h3>
              <p className='text-slate-500 dark:text-slate-400 text-xs mt-2 leading-relaxed'>
                Finalize paperwork with 100% transparency, zero hidden charges, and collect your keys!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. LATEST USER REVIEWS */}
      <div className='max-w-7xl mx-auto px-6 py-20'>
        <div className='text-center mb-12'>
          <span className='text-blue-600 dark:text-blue-400 font-bold text-xs tracking-widest uppercase'>Client Stories</span>
          <h2 className='text-3xl font-bold text-slate-800 dark:text-white mt-1'>Latest User Reviews</h2>
          <p className='text-slate-500 dark:text-slate-400 text-sm mt-2'>Real experiences from buyers, renters, and homeowners.</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between'>
            <div>
              <div className='flex text-amber-400 gap-1 mb-4 text-sm'>
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className='text-slate-600 dark:text-slate-300 text-sm italic leading-relaxed'>
                "Found our family villa within 2 weeks using HomeHorizon! The neighborhood filters and agent transparency were outstanding."
              </p>
            </div>
            <div className='flex items-center gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800'>
              <img
                src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
                alt='Sarah M.'
                className='w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20'
              />
              <div>
                <h4 className='font-bold text-sm text-slate-800 dark:text-white'>Sarah Jenkins</h4>
                <p className='text-xs text-slate-400'>Luxury Villa Buyer</p>
              </div>
            </div>
          </div>

          <div className='p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between'>
            <div>
              <div className='flex text-amber-400 gap-1 mb-4 text-sm'>
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className='text-slate-600 dark:text-slate-300 text-sm italic leading-relaxed'>
                "Listing my apartment on this platform was super fast. Connected with 3 verified renters on the very first day. Highly recommended!"
              </p>
            </div>
            <div className='flex items-center gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800'>
              <img
                src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
                alt='David K.'
                className='w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20'
              />
              <div>
                <h4 className='font-bold text-sm text-slate-800 dark:text-white'>David Miller</h4>
                <p className='text-xs text-slate-400'>Property Owner</p>
              </div>
            </div>
          </div>

          <div className='p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between'>
            <div>
              <div className='flex text-amber-400 gap-1 mb-4 text-sm'>
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className='text-slate-600 dark:text-slate-300 text-sm italic leading-relaxed'>
                "The price comparison and instant mortgage calculations helped us stay within our budget while finding a dream apartment in Manhattan."
              </p>
            </div>
            <div className='flex items-center gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800'>
              <img
                src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
                alt='Elena R.'
                className='w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20'
              />
              <div>
                <h4 className='font-bold text-sm text-slate-800 dark:text-white'>Elena Rostova</h4>
                <p className='text-xs text-slate-400'>Downtown Renter</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. CALL TO ACTION */}
      <div className='max-w-7xl mx-auto px-6 mb-20'>
        <div className='rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-8 sm:p-14 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6'>
          <div className='max-w-xl text-center md:text-left'>
            <h2 className='text-2xl sm:text-4xl font-extrabold tracking-tight'>Are You a Property Owner?</h2>
            <p className='text-blue-100 text-sm sm:text-base mt-2'>
              Sell or rent your residential spaces with genuine buyers across the country.
            </p>
          </div>
          <Link
            to='/create-listing'
            className='px-8 py-3.5 bg-white text-blue-600 hover:bg-slate-100 font-bold text-sm rounded-xl shadow-lg transition-all whitespace-nowrap'
          >
            List Your Property Today
          </Link>
        </div>
      </div>

      {/* 6. BOTTOM / FOOTER */}
      <footer className='bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800'>
        <div className='max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800'>
          <div className='flex flex-col gap-4'>
            <h3 className='text-2xl font-bold text-white tracking-tight'>
              Home<span className='text-blue-500'>Horizon</span>
            </h3>
            <p className='text-xs text-slate-400 leading-relaxed'>
              HomeHorizon is your trusted real estate marketplace to buy, rent, and discover properties with verified sellers and transparent pricing.
            </p>
            <div className='flex gap-3 text-white/80 mt-2'>
              <a href='#' className='w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors'>
                <FaFacebookF className='text-xs' />
              </a>
              <a href='#' className='w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors'>
                <FaTwitter className='text-xs' />
              </a>
              <a href='#' className='w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors'>
                <FaInstagram className='text-xs' />
              </a>
              <a href='#' className='w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors'>
                <FaLinkedinIn className='text-xs' />
              </a>
            </div>
          </div>

          <div className='flex flex-col gap-3'>
            <h4 className='text-white font-semibold text-sm'>Quick Navigation</h4>
            <Link to='/' className='text-xs hover:text-blue-400 transition-colors'>Home</Link>
            <Link to='/search' className='text-xs hover:text-blue-400 transition-colors'>All Properties</Link>
            <Link to='/search?offer=true' className='text-xs hover:text-blue-400 transition-colors'>Featured Offers</Link>
            <Link to='/search?type=rent' className='text-xs hover:text-blue-400 transition-colors'>Rental Homes</Link>
            <Link to='/search?type=sale' className='text-xs hover:text-blue-400 transition-colors'>Properties for Sale</Link>
          </div>

          <div className='flex flex-col gap-3'>
            <h4 className='text-white font-semibold text-sm'>Company & Legal</h4>
            <Link to='/about' className='text-xs hover:text-blue-400 transition-colors'>About Us</Link>
            <a href='#' className='text-xs hover:text-blue-400 transition-colors'>Terms of Service</a>
            <a href='#' className='text-xs hover:text-blue-400 transition-colors'>Privacy Policy</a>
            <a href='#' className='text-xs hover:text-blue-400 transition-colors'>Agent Guidelines</a>
            <a href='#' className='text-xs hover:text-blue-400 transition-colors'>Security & Trust</a>
          </div>

          <div className='flex flex-col gap-3'>
            <h4 className='text-white font-semibold text-sm'>Get in Touch</h4>
            <div className='flex items-center gap-2.5 text-xs'>
              <FaMapMarkerAlt className='text-blue-500 flex-shrink-0' />
              <span>742 Evergreen Terrace, Raipur, Chhatisgrah</span>
            </div>
            <div className='flex items-center gap-2.5 text-xs'>
              <FaPhoneAlt className='text-blue-500 flex-shrink-0' />
              <span>+1 (800) 555-4321</span>
            </div>
            <div className='flex items-center gap-2.5 text-xs'>
              <FaEnvelope className='text-blue-500 flex-shrink-0' />
              <span>support@homehorizon.com</span>
            </div>
          </div>
        </div>

        <div className='max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4'>
          <p>© {new Date().getFullYear()} HomeHorizon Real Estate Inc. All rights reserved.</p>
          <p>Built with ❤️ for real estate enthusiasts.</p>
        </div>
      </footer>
    </div>
  );
}