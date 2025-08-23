// Add this style at the top of your component
const rtlStyles = {
  navLink: {
    textAlign: 'right',
    direction: 'rtl',
    marginLeft: 'auto'
  },
  navMenu: {
    flexDirection: 'row-reverse'
  }
};

// Modify the Nav component to support RTL
<Nav 
  className='me-auto ms-0 my-2 my-lg-0' 
  navbarScroll
  style={languageCode === 'ar' ? rtlStyles.navMenu : {}}
>
  <Link
    className={classNames('nav-link ps-lg-0', {
      'fw-bold': isActive('/'),
      'text-end': languageCode === 'ar'
    })}
    href='/'
    style={languageCode === 'ar' ? rtlStyles.navLink : {}}
  >
    {homeText}
  </Link>
  <Link
    className={classNames('nav-link', {
      'fw-bold': isActive('/about-us'),
      'text-end': languageCode === 'ar'
    })}
    href='/about-us'
    style={languageCode === 'ar' ? rtlStyles.navLink : {}}
  >
    {aboutText}
  </Link>
  {/* Apply the same pattern to other nav links */}
</Nav>

// For mobile menu, update the Offcanvas nav links
<Nav className='flex-column m-0'>
  <Link
    href='/'
    className={classNames('nav-link ps-lg-0', {
      'fw-bold': isActive('/'),
      'text-end': languageCode === 'ar'
    })}
    onClick={handleClose}
    style={languageCode === 'ar' ? rtlStyles.navLink : {}}
  >
    {homeText}
  </Link>
  {/* Apply the same pattern to other mobile nav links */}
</Nav>