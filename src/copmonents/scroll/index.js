import React ,{ createRef }from 'react';
const list = [
  {
    id: 'a',
    firstname: 'Robin',
    lastname: 'Wieruch',
    year: 1988,
  },
  {
    id: 'b',
    firstname: 'Dave',
    lastname: 'Davidds',
    year: 1990,
  },
  {
    id: 'c',
    firstname: 'Azad',
    lastname: 
    'Zarshad',
    year: 1993,
  },
  {
    id: 'd',
    firstname: 'Parisa',
    lastname: 'Ebrahimi',
    year: 1990,
  },
  {
    id: 'e',
    firstname: 'Hossein',
    lastname: 'Rezayi',
    year: 1989,
  },
];
const List = () => (
  <ul>
    {list.map(item => {
        const ref = createRef();
        const handleClick = () =>
            ref.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });

        return (
            <li
            key={item.id}
            ref={ref}
            style={{ height: '1250px', border: '1px solid black' }}
            >
            <div>{item.id}</div>
            <div>{item.firstname}</div>
            <div>{item.lastname}</div>
            <div>{item.year}</div>
            <button type="button" onClick={handleClick}>
            Scroll Into View
            </button>

            </li>
        );
    })}
  </ul>
);
const OutSideList = () => {
    const refs = list.reduce((acc, value) => {
      acc[value.id] = createRef();
      return acc;
    }, {});
    console.log(refs)
    const handleClick = id =>
      refs[id].current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    return (
      <div>
        <ul>
          {list.map(item => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleClick(item.id)}
              >
                Scroll Item {item.id} Into View
              </button>
            </li>
          ))}
        </ul>
        <ul>
          {list.map(item => (
            <li
              key={item.id}
              ref={refs[item.id]}
              style={{ height: '250px', border: '1px solid black' }}
            >
              <div>{item.id}</div>
              <div>{item.firstname}</div>
              <div>{item.lastname}</div>
              <div>{item.year}</div>
            </li>
          ))}
        </ul>
      </div>
    );
  };
export default OutSideList;
// export default List;