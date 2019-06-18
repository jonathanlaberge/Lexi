<?php
namespace App\Http\Controllers;

use App\Model\Fiche;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function __construct()
    {
		$this->middleware('auth');
    }
    
    public function FicheValidation(Request $request)
    {
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////historique
		if (!$request->has(['idFiche', 'idCategorie', 'listeQuestion']))
			return response()->json(["code" => "400", "message" => "Missing Parameter"], 400);
		
		if (!$request->filled(['idFiche', 'idCategorie', 'listeQuestion']))
			return response()->json(["code" => "400", "message" => "Unfilled Parameter"], 400);
		
		$idCategorie = $request->input('idCategorie');
		$IdFiche = $request->input('IdFiche') ;
		$questionACorriger = json_decode($request->input('listeQuestion'));
		
		$questions = DB::select('
			SELECT idQuestion, bonneReponse 
			FROM question 
			JOIN fiche ON question.idFiche = fiche.idFiche AND 
			question.idCategorie = fiche.idCategorie 
			WHERE  question.idFiche = ? AND
			question.idCategorie = ?', [$IdFiche,$idCategorie]);


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
			

				if (questionACorriger[$i] == $questions[$i]->bonneReponse)
				{
					$reponseBool[$i] = true;
				}
				else
				{
					$nombreErreur++;
					$reponseBool[$i] = false;
				}
			}

			return response()->json(
				['correction' => $reponseBool],
				['nombreErreur'=> $nombreErreur],
				['bonnesReponses'=> $bonnesReponses], 200);
		}
		else
		{
			return response()->json(["code" => "400", "message" => "Le nombre de réponse nest pas équivalent"], 400);
		}
    }
    
    public function FicheGet(Request $request, $idCategorie, $idFiche)
    {
        if (!IsValidID($idCategorie) || !IsValidID($idFiche))
            return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);
		
		//////////////////////////////////////SELON LELEVE PLAYLIST
		$fiche = new Fiche();
		
		$result = DB::select('
			SELECT * FROM `fiche`
			where `idFiche` = ? AND
			`idCategorie` = ?',[$idFiche ,$idCategorie]);
		
		if ($result == null) 
		{
			return response()->json(["code" => "404", "message" => "Data Not Found"], 404);
		}
		
		$fiche->idFiche = $result[0]->idFiche;
		$fiche->idCategorie = $result[0]->idCategorie;
		$fiche->titre = $result[0]->titre;
		$fiche->dateCreation = $result[0]->dateCreation;
		$fiche->idMaitresseCreatrice = $result[0]->idMaitresseCreatrice;


		$fiche->listeQuestion = DB::select("
			SELECT `idQuestion`, `quesion`, `choixDeReponses`
			FROM `question`
			WHERE `idFiche`=? AND
			`idCategorie`=?", [$idFiche ,$idCategorie]);
			
		 return response()->json($fiche, 200);
    }
    
    public function FicheGetList(Request $request, $page = null)
    {
		if (!IsValidID($page))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);
		
		$idMaitresseCreatrice = JWTAuth::parseToken()->getPayload()["sub"];

		//////////////////////////////////////SELON LELEVE PLAYLIST

		return response()->json(DB::select('
			SELECT * 
			FROM `fiche` 
			WHERE wwwwwwwwwwwwwwwww//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			LIMIT ?,30',[($page * 30) - 30]), 200);
    }
    
    public function Historique(Request $request, $page = null)
    {
		$idEleve = JWTAuth::parseToken()->getPayload()["idEleveEnCours"];
		
		if ($idEleve == 0)
			return response()->json(["code" => "403", "message" => "No student selected"], 403);
		
		if (!IsValidID($page))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

		return response()->json(DB::select('SELECT * FROM `historique` WHERE idEleve = ? LIMIT ?,30',[$idEleve, ($page * 30) - 30]), 200);
		
    }
    
	protected function IsValidID($var)
    {
		if ($var <= 0 || $var > 2147483647 || $var == null)
			return false;

		return true; 
    }
}
