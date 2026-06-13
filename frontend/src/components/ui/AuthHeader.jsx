function AuthHeader({ heading, subHeading }) {
  return (
    <div className="flex flex-col gap-3 items-center justify-center">
      <h1 className="text-4xl md:text-5xl font-bold text-text text-center">
        {heading}
      </h1>
      <p className="font-semibold text-muted">{subHeading}</p>
    </div>
  );
}

export default AuthHeader;
