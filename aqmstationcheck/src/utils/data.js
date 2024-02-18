export const fetchStation = `*[_type == "station"] | order(_createdAt desc) {
    image{
      asset->{
        url
      }
    },
        _id,
        title,
        note,
        isCompleted,
        analyzers,
        address,
        postedBy->{
          _id,
          userName,
          image
        },
        officeType,
        networkType,
        comments[]{
          commentTitle,
          comment,
          _key,
          postedBy->{
            _id,
            userName,
            image
          },
          _createdAt
        }
      } `;
  
  export const fethAnalyzers = `
  *[!(_id in path('drafts.**')) && _type == "analyzers"] 
  | order(_createdAt desc)
  {
    image{
      asset->{
        url
      }
    },
    analyzerMake,
    analyzerParameter,
    note,
    model,
    manual,
    stationBelong,
    comments,
    _id,
    addedBy->{
      _id,
      userName, 
    },
    sin
  }`;

  export const fethStationDetails = (stationDetails) => {
    const query = `*[!(_id in path('drafts.**')) && _type == "station" && _id == '${stationDetails}']{
      image{
        asset->{
          url
        }
      },
          _id,
          title,
          note,
          analyzers,
          address,
          postedBy->{
            _id,
            userName,
            image
          },
          officeType,
          networkType,
          comments[]{
            commentTitle,
            comment,
            _key,
            postedBy->{
              _id,
              userName,
              image
            },
            _createdAt
          }
    }`
    return query;
  }

  export const fethAnalyzerDetails = (analyzerId) => {
    const query = `*[!(_id in path('drafts.**')) && _type == "analyzers" && _id == '${analyzerId}']{
      image{
          asset->{
            url
          }
        },
        analyzerMake,
        analyzerParameter,
        note,
        manual,
        stationBelong,
        model,
        _id,
        addedBy->{
          _id,
          userName, 
        },
        sin,
        comments[]{
          comment,
          _key,
          postedBy->{
            _id,
            userName,
            image
          },
          _createdAt
        }
    }`
    return query;
  }
  

 
