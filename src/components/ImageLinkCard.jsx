import React from 'react';
import { Link } from 'react-router-dom';

export default function ImageLinkCard({ title, description, image, to, icon }) {
  return <Link to={to} className="group relative block min-h-72 overflow-hidden rounded-2xl border border-white/10 bg-dark shadow-lg transition duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-accent/10">
    <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-500 group-hover:scale-110 group-hover:opacity-70" />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent"></div>
    <div className="relative flex min-h-72 flex-col justify-end p-6"><span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-accent text-white"><i className={`fa-solid ${icon}`}></i></span><h3 className="text-xl font-bold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-gray-200">{description}</p><span className="mt-5 text-sm font-bold text-accent">Explore listings <i className="fa-solid fa-arrow-right ml-1 transition-transform group-hover:translate-x-1"></i></span></div>
  </Link>;
}
