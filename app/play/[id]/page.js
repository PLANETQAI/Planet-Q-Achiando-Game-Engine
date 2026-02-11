
import GameEditor from '../_components/GameEditor';

export default async function EditGamePage({ params }) {
    const param = await params;
    const id = param.id;
    return <GameEditor mode="edit" id={id} />;
}
