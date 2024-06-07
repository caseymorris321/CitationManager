import React from 'react';
import JournalName from './journalName';
import ItalicText from './ItalicText';

const formatCSECitation = (citation) => {
  const { authors, paperTitle, journal, publicationDate, DOI } = citation;
  const authorStr = authors.join(', ');
  const year = publicationDate ? new Date(publicationDate).getUTCFullYear() : '';
  const volume = journal?.volume ? `${journal.volume}` : '';
  const issue = journal?.issue ? `(${journal.issue})` : '';
  const pages = journal?.pages ? `:${journal.pages}` : '';
  const journalName = journal?.journalName ? <><JournalName name={journal.journalName} />{' '}</> : '';
  const doiPart = DOI ? `DOI: ${DOI}` : '';

  // Format the title with italics for words wrapped in **
  const formattedTitle = paperTitle.split('*').map((part, index) => {
    if (index % 2 === 1) {
      return <ItalicText key={index} text={part} />;
    }
    return part;
  });

  return (
    <>
      {`${authorStr}. ${year}. `}
      {formattedTitle}
      {`. `}
      {journalName}
      {`${volume}${issue}${pages}. ${doiPart}`}
    </>
  );
};

const formatAPACitation = (citation) => {
  //
  return '';
};

const formatMLACitation = (citation) => {
  // 
  return '';
};

const citationFormatters = {
  CSE: formatCSECitation,
  APA: formatAPACitation,
  MLA: formatMLACitation,
};

const formatCitation = (citation) => {
  const formatter = citationFormatters[citation.citationStyle];
  return formatter ? formatter(citation) : '';
};

export default formatCitation;
