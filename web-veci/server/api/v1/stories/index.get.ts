import { makeMockStories } from '../../../mock/story'

/** GET /stories — historias visibles en el raíl superior del feed. */
export default defineMockHandler(200, () => makeMockStories())
