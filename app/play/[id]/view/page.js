
import GameEditor from '../../_components/GameEditor';

export default async function ViewGamePage({ params }) {
    const param = await params;
    const id = param.id;
    return <GameEditor mode="view" id={id} />;
}
