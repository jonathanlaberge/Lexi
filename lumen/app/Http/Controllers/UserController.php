<?php
namespace App\Http\Controllers;

use App\Model\Fiche;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    public function __construct()
    {
		$this->middleware('auth');
    }

    public function FicheValidation(Request $request)
    {
        $body = json_decode($request->getContent());

        $idEleve = JWTAuth::parseToken()->getPayload()["idEleveEnCours"];

		if(!isset($body->idFiche, $body->idCategorie, $body->listeQuestion))
            return response()->json(['code' => 400 ,'message' => 'Invalid Parameter'], 400);

		$questionACorriger = $body->listeQuestion;

		$questions = DB::select('
			SELECT idQuestion, bonneReponse
			FROM question
			JOIN fiche ON question.idFiche = fiche.idFiche AND
			question.idCategorie = fiche.idCategorie
			WHERE  question.idFiche =? AND
			question.idCategorie =?', [$body->idFiche,$body->idCategorie]);
			
		if ($questions == null)
			return response()->json(["code" => "404", "message" => "Data Not Found"], 404);

		$bonnesReponses = array();
		foreach ($questions as $question)
		{
			$bonnesReponses[$question->idQuestion] = $question->bonneReponse;
		}


		$reponseBool = array();
		$nombreErreur = 0;

		if (count($questionACorriger) <= count($questions))
		{
			for ($i = 0; $i < count($questionACorriger); $i++)
			{
				if ($questionACorriger[$i] == $questions[$i]->bonneReponse)
				{
					$reponseBool[$i] = true;
				}
				else
				{
					$nombreErreur++;
					$reponseBool[$i] = false;
				}
            }

			$historique = DB::select('
				SELECT `nombreTentative`, `erreurMax`, `erreurMin`
				FROM `historique`
				WHERE idFiche =? AND
				idCategorie =? AND
				idEleve =?', [$body->idFiche, $body->idCategorie, $idEleve]);

            if ($historique != null)
            {
                DB::update('
                    UPDATE `historique` SET
                    `nombreTentative`=?,`erreurMax`=?,`erreurMin`=?
                    WHERE idFiche =? AND
                    idCategorie =? AND
                    idEleve =?', [
                        $historique[0]->nombreTentative + 1,
                        max($historique[0]->erreurMax, $nombreErreur),
                        min($historique[0]->erreurMin, $nombreErreur),
                        $body->idFiche,
                        $body->idCategorie,
                        $idEleve]);
            }
            else
            {
                DB::update('
                    INSERT INTO `historique`
                    (`idEleve`, `idFiche`, `idCategorie`, `nombreTentative`, `erreurMax`, `erreurMin`)
                    VALUES (?,?,?,?,?,?)', [
                        $idEleve,
                        $body->idFiche,
                        $body->idCategorie,
                        1,
                        $nombreErreur,
                        $nombreErreur]);
            }

			return response()->json(
				['correction' => $reponseBool,
				'nombreErreur'=> $nombreErreur,
				'bonnesReponses'=> $bonnesReponses], 200);
		}
		else
		{
			return response()->json(["code" => "400", "message" => "Answer Number Mismatch"], 400);
		}
    }

    public function FicheGet(Request $request, $idCategorie, $idFiche)
    {
        if (!$this->IsValidID($idCategorie) || !$this->IsValidID($idFiche))
            return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

        $idEleve = JWTAuth::parseToken()->getPayload()["idEleveEnCours"];
        $idMaitresse = JWTAuth::parseToken()->getPayload()["sub"];

		$fiche = new Fiche();

		$result = DB::select('
            SELECT `fiche`.`idFiche`, `fiche`.`idCategorie`, `titre`, `dateCreation`, `estPublic`, `maitresse`.`prenom`, `maitresse`.`nom` FROM `fiche`
            JOIN `maitresse` ON `maitresse`.`idMaitresse` = `fiche`.`idMaitresseCreatrice`
            JOIN `fiche_a_remplir` ON `fiche_a_remplir`.`idFiche` = `fiche`.`idFiche` AND `fiche_a_remplir`.`idCategorie` = `fiche`.`idCategorie`
			WHERE `fiche`.`idFiche` =? AND
            `fiche`.`idCategorie` =? AND
            `fiche_a_remplir`.`idEleve` =? AND
            `fiche_a_remplir`.`idMaitresse` =?',[$idFiche ,$idCategorie, $idEleve, $idMaitresse]);

		if ($result == null)
		{
			return response()->json(["code" => "404", "message" => "Data Not Found"], 404);
		}

		$fiche->idFiche = $result[0]->idFiche;
		$fiche->idCategorie = $result[0]->idCategorie;
		$fiche->titre = $result[0]->titre;
		$fiche->dateCreation = $result[0]->dateCreation;
		$fiche->estPublic = $result[0]->estPublic;
		$fiche->maitresseNom = $result[0]->nom;
		$fiche->maitressePrenom = $result[0]->prenom;


		$fiche->listeQuestion = DB::select("
			SELECT `idQuestion`, `quesion`, `choixDeReponses`
			FROM `question`
			WHERE `idFiche`=? AND
			`idCategorie`=?", [$idFiche ,$idCategorie]);

		 return response()->json($fiche, 200);
    }

    public function FicheGetList(Request $request, $page = 1)
    {
		if (!$this->IsValidID($page))
            return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

		$idEleve = JWTAuth::parseToken()->getPayload()["idEleveEnCours"];
        $idMaitresse = JWTAuth::parseToken()->getPayload()["sub"];

		return response()->json(DB::select('
			SELECT `fiche`.`idFiche`, `fiche`.`idCategorie`, `titre`, `dateCreation`, `estPublic`, `maitresse`.`prenom`, `maitresse`.`nom` FROM `fiche`
            JOIN `maitresse` ON `maitresse`.`idMaitresse` = `fiche`.`idMaitresseCreatrice`
            JOIN `fiche_a_remplir` ON `fiche_a_remplir`.`idFiche` = `fiche`.`idFiche` AND `fiche_a_remplir`.`idCategorie` = `fiche`.`idCategorie`
			WHERE `fiche_a_remplir`.`idEleve` =? AND
            `fiche_a_remplir`.`idMaitresse` =?
			LIMIT ?,30',[$idEleve, $idMaitresse, ($page * 30) - 30]), 200);
    }

    public function Historique(Request $request, $page = 1)
    {
		$idEleve = JWTAuth::parseToken()->getPayload()["idEleveEnCours"];

		if ($idEleve == 0)
			return response()->json(["code" => "403", "message" => "No student selected"], 403);

		if (!$this->IsValidID($page))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

		return response()->json(DB::select('SELECT * FROM `historique` WHERE idEleve = ? LIMIT ?,30',[$idEleve, ($page * 30) - 30]), 200);

    }

	private function IsValidID($var)
    {
		if ($var <= 0 || $var > 2147483647 || $var == null)
			return false;

		return true;
    }
}
