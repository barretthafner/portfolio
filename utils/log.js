import Captain from 'captainslog';

const cptn = new Captain();
cptn.toggleDebug(global.site && global.site.isDebug);

export default cptn;
