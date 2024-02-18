import { React } from 'react';
import './navigation.css';
import { IoMdSearch } from 'react-icons/io'

function Navigation({ setSearchTerm, searchTerm }) {
  return (
    <div className='searchNav'>
      <div className='navElements'>
        <IoMdSearch fontSize={25} />
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search station by title/description/author"
          value={searchTerm}
        />
      </div>

    </div>
  )
}

export default Navigation;
