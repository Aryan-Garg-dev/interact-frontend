import getDomainName from '@/utils/funcs/get_domain_name';
import Link from 'next/link';
import React from 'react';
import getIcon from '@/utils/funcs/get_icon';

interface Props {
  links: string[];
  title?: string;
}

const Links = ({ links, title = 'Links' }: Props) => {
  return (
    <div>
      {links && links.length > 0 && (
        <div className="w-full flex flex-col gap-2 relative">
          <div className="text-lg font-semibold">{title}</div>
          <div className="w-full flex gap-4 justify-start flex-wrap">
            {links.map(link => {
              return (
                <Link key={link} href={link} target="_blank" className="relative group">
                  <div className="w-fit absolute -top-12 left-0 scale-0 px-3 rounded-lg border-2  border-gray-200 bg-white py-2 text-sm font-semibold shadow-xl transition-ease-300 capitalize group-hover:scale-100">
                    {getDomainName(link)}
                  </div>
                  <div className="hover:scale-110 transition-ease-300"> {getIcon(getDomainName(link), 40)}</div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Links;
